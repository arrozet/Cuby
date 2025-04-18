import React, { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef
import { useParams, useNavigate } from 'react-router-dom';
// Import GameWrapper and updated GameContainer/WinMessage
import { GameWrapper, GameContainer, WinMessage } from './Game.styles';
import Player from '../Player/Player';
import Level from '../Level/Level';
import Controls from '../UI/Control'; // Ensure Controls styles are responsive too
import BackArrow from '../common/BackArrow/BackArrow'; // Ensure BackArrow styles are responsive
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress'; // Corrected import if needed, assuming it's default export or named export
import { useSettings } from '../../context/SettingsContext';
import { useInversion } from '../../context/InversionContext'; // Import useInversion
import {
  // applyGravity, // Removed unused import
  checkPlatformCollisions,
  processTrampolineCollisions, // Corrected import name
  processObstacleCollisions,
  processPortalCollisions,
  checkVictoryCondition
} from '../../utils/physics';
// Import base dimensions from constants
// Added GRAVITY import
import { PLAYER_SIZE, MOVEMENT_SPEED, JUMP_FORCE, BASE_GAME_WIDTH, BASE_GAME_HEIGHT, GRAVITY } from '../../constants/gameConstants';
import { level1 } from '../../levels/level1';
import { level2 } from '../../levels/level2';
import { getUserLevelById } from '../../utils/levelManager';
// Import game element classes if needed for reconstruction
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';

/**
 * Game Component - El componente principal del juego que maneja la lógica del gameplay
 *
 * Este componente gestiona:
 * - El estado del jugador (posición, velocidad, etc.)
 * - La detección de colisiones con plataformas y objetos
 * - El sistema de color invertido
 * - La lógica de victoria
 * - Los controles del jugador
 *
 * @component
 */
const Game = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  // const { keyMapping } = useSettings(); // Removed unused variable
  const { isInverted } = useInversion(); // Get inversion state
  const [currentLevel, setCurrentLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [scale, setScale] = useState(1); // State for scale factor
  const [gamePos, setGamePos] = useState({ top: 0, left: 0 }); // State for centering offset

  // --- Game State ---
  // Store player state in a ref for direct access in game loop, update state less frequently if needed
  const playerStateRef = useRef({
    x: 50, y: 450, vx: 0, vy: 0, isOnGround: false, canJump: true, isCrouching: false, weight: 1, // Added weight for trampoline physics
    // Coyote Time and Jump Buffering states
    coyoteTimeCounter: 0,
    jumpBufferCounter: 0,
  });
  // State for React rendering
  const [playerRenderState, setPlayerRenderState] = useState(playerStateRef.current);

  // Constants for jump timing tolerance
  const COYOTE_TIME_DURATION = 0.1; // seconds
  const JUMP_BUFFER_DURATION = 0.1; // seconds

  // --- Load Level ---
  useEffect(() => {
    setIsLoading(true);
    setHasWon(false);
    let levelData;
    const isUserLevel = window.location.hash.includes('/game/user/');

    try {
      if (isUserLevel) {
        const userLevel = getUserLevelById(levelId);
        if (userLevel) {
          // Reconstruct level objects to ensure methods are available
          levelData = {
            ...userLevel,
            platforms: (userLevel.platforms || []).map(p => p instanceof Platform ? p : new Platform(p)),
            obstacles: (userLevel.obstacles || []).map(o => o instanceof Spike ? o : new Spike(o)),
            trampolines: (userLevel.trampolines || []).map(t => t instanceof Trampoline ? t : new Trampoline(t)),
            portals: (userLevel.portals || []).map(p => p instanceof Portal ? p : new Portal(p)),
            goal: userLevel.goal instanceof Goal ? userLevel.goal : new Goal(userLevel.goal || { x: 700, y: 500 }),
            playerStart: userLevel.playerStart || { x: 50, y: 450 } // Ensure playerStart exists
          };
        } else {
          throw new Error("User level not found");
        }
      } else {
        switch (levelId) {
          case '1': levelData = level1; break;
          case '2': levelData = level2; break;
          default: throw new Error("Predefined level not found");
        }
        // Ensure predefined levels also have playerStart
        if (!levelData.playerStart) {
            levelData.playerStart = { x: 50, y: 450 };
        }
      }

      setCurrentLevel(levelData);
      // Reset player state ref and render state
      playerStateRef.current = {
        ...playerStateRef.current, // Keep weight or other persistent properties if needed
        x: levelData.playerStart.x,
        y: levelData.playerStart.y,
        vx: 0,
        vy: 0,
        isOnGround: false,
        canJump: true, // Reset canJump
        isCrouching: false,
        coyoteTimeCounter: 0, // Reset counters
        jumpBufferCounter: 0,
      };
      setPlayerRenderState(playerStateRef.current);

    } catch (error) {
      console.error("Error loading level:", levelId, error);
      navigate(isUserLevel ? '/user-levels' : '/levels'); // Redirect on error
      return; // Stop execution
    } finally {
      setIsLoading(false);
    }
  }, [levelId, navigate]);


  // --- Scaling and Centering Logic ---
  useEffect(() => {
    const calculateLayout = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const scaleX = screenWidth / BASE_GAME_WIDTH;
      const scaleY = screenHeight / BASE_GAME_HEIGHT;
      const newScale = Math.min(scaleX, scaleY); // Fit inside screen

      const scaledWidth = BASE_GAME_WIDTH * newScale;
      const scaledHeight = BASE_GAME_HEIGHT * newScale;

      const newTop = (screenHeight - scaledHeight) / 2;
      const newLeft = (screenWidth - scaledWidth) / 2;

      setScale(newScale);
      setGamePos({ top: newTop, left: newLeft });
    };

    calculateLayout(); // Initial calculation
    window.addEventListener('resize', calculateLayout); // Recalculate on resize

    return () => window.removeEventListener('resize', calculateLayout); // Cleanup listener
  }, []); // Empty dependency array, runs once on mount and cleans up


  // --- Input Handling ---
  // Correct usage of useKeyPress hook
  const keysPressed = useKeyPress(); // Returns object like { left: false, jump: true, ... }

  // --- Game Loop Logic ---
  const gameTick = useCallback((deltaTime) => {
    if (!currentLevel || hasWon || isLoading) return;

    // Work directly with the ref for physics calculations
    const player = playerStateRef.current;

    // --- Update Counters ---
    player.coyoteTimeCounter = player.isOnGround ? COYOTE_TIME_DURATION : Math.max(0, player.coyoteTimeCounter - deltaTime);
    player.jumpBufferCounter = Math.max(0, player.jumpBufferCounter - deltaTime);

    // --- Input Processing ---
    // Horizontal Movement
    player.vx = 0;
    if (keysPressed.left) player.vx -= MOVEMENT_SPEED;
    if (keysPressed.right) player.vx += MOVEMENT_SPEED;

    // Jump Buffering
    if (keysPressed.jump) {
      player.jumpBufferCounter = JUMP_BUFFER_DURATION;
    }

    // --- Gravity ---
    // Apply gravity - velocity is updated directly within checkPlatformCollisions now
    // Only apply gravity if not on ground OR if coyote time is active (to allow falling)
    if (!player.isOnGround && player.coyoteTimeCounter <= 0) {
        player.vy += GRAVITY * player.weight * deltaTime;
    } else if (player.isOnGround) {
        // Ensure vertical velocity is 0 when grounded, unless just bounced
        // This might be handled by collision resolution, but good to be sure
        // player.vy = 0; // Re-evaluate if needed, collision should handle this
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
      // player.canJump = false; // Removed - buffering handles intention
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

    // Velocities are now modified directly within checkPlatformCollisions
    // if (collisionResult.bottom || collisionResult.top) player.vy = 0;
    // if (collisionResult.left || collisionResult.right) player.vx = 0;


    // Trampolines (apply after platform resolution)
    // Pass the updated playerCollider state after platform collisions
    playerCollider.x = player.x; // Use resolved position
    playerCollider.y = player.y;
    playerCollider.velocityY = player.vy; // Pass current velocity (potentially modified by platform collision)
    processTrampolineCollisions( // Corrected typo
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
    processObstacleCollisions(
        playerCollider,
        currentLevel.obstacles,
        isInverted,
        currentLevel.playerStart // Pass start position for reset
    );
    // Check if position was reset
    if (playerCollider.x === currentLevel.playerStart.x && playerCollider.y === currentLevel.playerStart.y) {
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
        return; // Skip rest of the tick after reset
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
        return; // Skip rest of tick
    }

    // --- Victory ---
    // Check victory with the final player position
    if (!hasWon && checkVictoryCondition({ x: player.x, y: player.y, width: PLAYER_SIZE, height: PLAYER_SIZE }, currentLevel.goal)) {
      setHasWon(true);
      // Unlock level logic could go here using markLevelAsCompleted from SettingsContext
    }

    // Update the state used for rendering
    setPlayerRenderState({ ...player });

  }, [currentLevel, keysPressed, hasWon, isLoading, isInverted]); // Dependencies


  // --- Restart Logic ---
  const restartGame = useCallback(() => {
    if (!currentLevel) return;
    // Reset player state ref and render state
    playerStateRef.current = {
      ...playerStateRef.current,
      x: currentLevel.playerStart.x,
      y: currentLevel.playerStart.y,
      vx: 0,
      vy: 0,
      isOnGround: false,
      canJump: true,
      coyoteTimeCounter: 0, // Reset counters on restart
      jumpBufferCounter: 0,
    };
    setPlayerRenderState(playerStateRef.current);
    setHasWon(false);
  }, [currentLevel]); // Dependency

  useEffect(() => {
    // Use action from keysPressed
    if (keysPressed.restart) {
      restartGame();
    }
  }, [keysPressed.restart, restartGame]); // Depend on the specific action state

  // Start the game loop
  useGameLoop(gameTick);

  // --- Navigation ---
  const handleBackToLevels = () => {
    const backPath = window.location.hash.includes('/game/user/') ? '/user-levels' : '/levels';
    navigate(backPath);
  };

  // --- Render ---
  if (isLoading || !currentLevel) {
    return <GameWrapper $isInverted={isInverted}><div>Loading Level...</div></GameWrapper>; // Show loading within wrapper
  }

  return (
    <GameWrapper $isInverted={isInverted}>
      <GameContainer
        baseWidth={BASE_GAME_WIDTH}
        baseHeight={BASE_GAME_HEIGHT}
        $isInverted={isInverted} // Pass inversion for border/bg
        style={{
          transform: `scale(${scale})`,
          top: `${gamePos.top}px`,
          left: `${gamePos.left}px`,
          position: 'absolute', // Position relative to the wrapper
        }}
      >
        {/* Position BackArrow relative to the scaled container */}
        <BackArrow onClick={handleBackToLevels} />
        <Level
          // Level uses base dimensions internally for element placement
          width={BASE_GAME_WIDTH}
          height={BASE_GAME_HEIGHT}
          level={currentLevel}
          // Context handles inversion within Level and its elements
        />
        <Player
          x={playerRenderState.x} // Use render state
          y={playerRenderState.y} // Use render state
          size={PLAYER_SIZE}
          // Context handles inversion within Player
        />
        {/* Controls might need style adjustments for responsiveness */}
        <Controls />

        {hasWon && (
          // Pass inversion state to WinMessage for styling
          <WinMessage $isInverted={isInverted}>
            <h2>¡Nivel completado!</h2>
            <button onClick={() => navigate(window.location.hash.includes('/game/user/') ? '/user-levels' : '/levels')}>Seleccionar nivel</button>
            <button onClick={restartGame}>Jugar de nuevo</button>
          </WinMessage>
        )}
      </GameContainer>
    </GameWrapper>
  );
};

export default Game;