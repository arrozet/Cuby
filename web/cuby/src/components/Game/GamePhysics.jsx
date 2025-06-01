import { 
  checkPlatformCollisions, 
  processTrampolineCollisions, 
  processObstacleCollisions,
  processPortalCollisions,
  checkVictoryCondition 
} from '../../utils/physics';
import { 
  PLAYER_SIZE, 
  MOVEMENT_SPEED, 
  JUMP_FORCE, 
  BASE_GAME_WIDTH, 
  BASE_GAME_HEIGHT, 
  GRAVITY,
  COYOTE_TIME_DURATION,
  JUMP_BUFFER_DURATION
} from '../../constants/gameConstants';

/**
 * Hook para manejar toda la lógica de física y colisiones del juego
 * 
 * @param {Object} playerStateRef - Referencia al estado del jugador
 * @param {Object} playerRenderState - Estado del jugador para renderizado
 * @param {Function} setPlayerRenderState - Función para actualizar el estado del renderizado
 * @param {Object} currentLevel - Nivel actual del juego
 * @param {Object} keysPressed - Teclas presionadas actualmente
 * @param {Boolean} isInverted - Si el juego está en modo invertido
 * @param {Boolean} hasWon - Si el jugador ha ganado
 * @param {Function} setHasWon - Función para actualizar el estado de victoria
 * @param {Function} markLevelAsCompleted - Función para marcar el nivel como completado
 * @param {String} levelId - ID del nivel actual
 * @returns {Function} - Función gamePhysicsTick para usar en el game loop
 */
export const useGamePhysics = (
  playerStateRef,
  setPlayerRenderState,
  currentLevel,
  keysPressed,
  isInverted,
  hasWon,
  setHasWon,
  markLevelAsCompleted,
  levelId,
  isLoading,
  onPlayerDeath
) => {  // Game physics tick function to be used in the game loop
  const gamePhysicsTick = (deltaTime) => {
    if (!currentLevel || hasWon || isLoading) return;

    // Work directly with the ref for physics calculations
    const player = playerStateRef.current;

    // --- Update Counters ---
    player.coyoteTimeCounter = player.isOnGround ? COYOTE_TIME_DURATION : Math.max(0, player.coyoteTimeCounter - deltaTime);
    player.jumpBufferCounter = Math.max(0, player.jumpBufferCounter - deltaTime);

    // --- Input Processing ---
    // Horizontal Movement - Consider both keyboard and mobile input
    if (keysPressed.left || keysPressed.right) {
      // Si hay input de teclado, usar ese input
      player.vx = keysPressed.left ? -MOVEMENT_SPEED : MOVEMENT_SPEED;
    }
    // Si no hay input de teclado, mantener la velocidad actual (para controles móviles)
    // La velocidad se resetea a 0 cuando se suelta el botón móvil

    // Jump Buffering
    if (keysPressed.jump) {
      player.jumpBufferCounter = JUMP_BUFFER_DURATION;
    }

    // --- Gravity ---
    // Apply gravity - velocity is updated directly within checkPlatformCollisions now
    // Only apply gravity if not on ground OR if coyote time is active (to allow falling)
    if (!player.isOnGround && player.coyoteTimeCounter <= 0) {
      player.vy += GRAVITY * player.weight * deltaTime;
    }

    // --- Jumping ---
    // Check for jump condition: buffered jump OR jump press during coyote time
    const canUseCoyoteTime = player.coyoteTimeCounter > 0 && !player.isOnGround; // Allow jump shortly after leaving ground
    const hasBufferedJump = player.jumpBufferCounter > 0;

    if (hasBufferedJump && (player.isOnGround || canUseCoyoteTime)) {
      player.vy = JUMP_FORCE; // Use the constant directly
      player.isOnGround = false;
      player.coyoteTimeCounter = 0; // Consume coyote time
      player.jumpBufferCounter = 0; // Consume jump buffer
    }

    // --- Collisions ---
    // Create a player object for collision checks
    let playerCollider = {
      x: player.x,
      y: player.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityX: player.vx, // Pass velocities
      velocityY: player.vy,
      weight: player.weight // Pass weight
    };

    // Platforms - Pass deltaTime and update player state based on the *returned* values
    const collisionResult = checkPlatformCollisions(
      playerCollider, // Pass the collider representation
      currentLevel.platforms,
      isInverted,
      deltaTime // Pass deltaTime
    );

    // Update player state based on platform collision resolution
    player.x = collisionResult.x;
    player.y = collisionResult.y;
    player.isOnGround = collisionResult.bottom; // Update ground status

    // Reset velocities based on collision flags returned by checkPlatformCollisions
    if (collisionResult.bottom || collisionResult.top) {
      player.vy = 0; // Stop vertical movement on vertical collision
    }
    if (collisionResult.left || collisionResult.right) {
      player.vx = 0; // Stop horizontal movement on horizontal collision
    }

    // Trampolines (apply after platform resolution)
    // Pass the updated playerCollider state after platform collisions
    playerCollider.x = player.x; // Use resolved position
    playerCollider.y = player.y;
    playerCollider.velocityY = player.vy; // Pass current velocity (potentially modified by platform collision)
    processTrampolineCollisions(
      playerCollider,
      currentLevel.trampolines,
      isInverted
    );
    // Update player state from the modified collider
    player.vy = playerCollider.velocityY;
    if (playerCollider.y !== player.y) { // If trampoline changed y position
      player.y = playerCollider.y;
      player.isOnGround = false; // Bounce means not on ground
    }

    // Obstacles (check final position for frame)
    // Pass the playerCollider with the latest position
    playerCollider.x = player.x;
    playerCollider.y = player.y;
    const oldX = player.x;
    const oldY = player.y;
    processObstacleCollisions(
      playerCollider,
      currentLevel.obstacles,
      isInverted,
      currentLevel.playerStart // Pass start position for reset
    );
    // Check if position was reset
    if (playerCollider.x === currentLevel.playerStart.x && playerCollider.y === currentLevel.playerStart.y) {
      // Notificar muerte solo si la posición cambió por colisión con obstáculo
      if (oldX !== currentLevel.playerStart.x || oldY !== currentLevel.playerStart.y) {
        // Notificar muerte y esperar a que termine la explosión antes de reiniciar
        onPlayerDeath && onPlayerDeath(oldX, oldY);
        // No reiniciar inmediatamente, esperar a que la explosión termine
        setTimeout(() => {
          // Reset player state fully
          player.x = playerCollider.x;
          player.y = playerCollider.y;
          player.vx = 0;
          player.vy = 0;
          player.isOnGround = false;
          player.canJump = true; // Allow jump immediately after reset
          player.coyoteTimeCounter = 0;
          player.jumpBufferCounter = 0;
          // Update render state immediately for reset
          setPlayerRenderState({ ...player });
        }, 0); 
        return; // Skip rest of the tick after reset
      }
    }

    // Portals (check final position for frame)
    // Pass the playerCollider with the latest position
    playerCollider.x = player.x;
    playerCollider.y = player.y;
    processPortalCollisions(
      playerCollider,
      currentLevel.portals,
      isInverted
    );
    // Check if position changed due to portal
    if (playerCollider.x !== player.x || playerCollider.y !== player.y) {
      player.x = playerCollider.x;
      player.y = playerCollider.y;
      player.vx = 0; // Reset velocity after teleport
      player.vy = 0;
      player.isOnGround = false; // Assume not on ground after teleport
      player.coyoteTimeCounter = 0; // Reset counters after teleport
      player.jumpBufferCounter = 0;
    }

    // --- Boundaries ---
    // Apply boundaries to the final resolved position
    if (player.x < 0) { player.x = 0; player.vx = 0; } // Stop velocity at boundary
    if (player.x + PLAYER_SIZE > BASE_GAME_WIDTH) { player.x = BASE_GAME_WIDTH - PLAYER_SIZE; player.vx = 0; } // Stop velocity at boundary
    if (player.y < 0) { player.y = 0; if(player.vy < 0) player.vy = 0; } // Stop velocity at boundary
    // Optional: Reset if falls too far
    if (player.y > BASE_GAME_HEIGHT + 200) { // Reset if fallen far below screen
      // Notificar muerte solo si cayó fuera del nivel
      onPlayerDeath && onPlayerDeath(player.x, player.y);
      // No reiniciar inmediatamente, esperar a que la explosión termine
      setTimeout(() => {
        // Reset player state fully
        player.x = currentLevel.playerStart.x;
        player.y = currentLevel.playerStart.y;
        player.vx = 0;
        player.vy = 0;
        player.isOnGround = false;
        player.canJump = true;
        player.coyoteTimeCounter = 0;
        player.jumpBufferCounter = 0;
        setPlayerRenderState({ ...player }); // Update render state
      }, 400); // Reducido a 400ms (200ms de explosión + 200ms de espera)
      return; // Skip rest of tick
    }

    // --- Victory ---
    // Check victory with the final player position
    if (!hasWon && checkVictoryCondition({ x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE }, currentLevel.goal)) {
      setHasWon(true);
      // Marca el nivel como completado para desbloquear el siguiente
      markLevelAsCompleted(Number(levelId));
    }

    // Update the state used for rendering
    setPlayerRenderState({ ...player });
  };

  return gamePhysicsTick;
};

export default useGamePhysics;
