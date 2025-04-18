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
  applyGravity,
  checkPlatformCollisions,
  processTramplineCollisions, // Corrected typo if necessary: processTrampolineCollisions
  processObstacleCollisions,
  processPortalCollisions,
  checkVictoryCondition
} from '../../utils/physics';
// Import base dimensions from constants
import { PLAYER_SIZE, MOVEMENT_SPEED, JUMP_FORCE, BASE_GAME_WIDTH, BASE_GAME_HEIGHT } from '../../constants/gameConstants';
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
  const { keyMapping } = useSettings(); // Assuming keyMapping provides action names
  const { isInverted } = useInversion(); // Get inversion state
  const [currentLevel, setCurrentLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWon, setHasWon] = useState(false);
  const [scale, setScale] = useState(1); // State for scale factor
  const [gamePos, setGamePos] = useState({ top: 0, left: 0 }); // State for centering offset

  // --- Game State ---
  // Store player state in a ref for direct access in game loop, update state less frequently if needed
  const playerStateRef = useRef({
    x: 50, y: 450, vx: 0, vy: 0, isOnGround: false, canJump: true, isCrouching: false, weight: 1 // Added weight for trampoline physics
  });
  // State for React rendering
  const [playerRenderState, setPlayerRenderState] = useState(playerStateRef.current);

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
        canJump: true,
        isCrouching: false,
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

    // --- Movement ---
    player.vx = 0;
    if (keysPressed.left) player.vx -= MOVEMENT_SPEED;
    if (keysPressed.right) player.vx += MOVEMENT_SPEED;

    // --- Gravity ---
    // Correct call to applyGravity
    player.vy = applyGravity(player.vy, player.isOnGround, deltaTime, player.weight);

    // --- Jumping ---
    if (keysPressed.jump && player.isOnGround && player.canJump) {
      player.vy = -JUMP_FORCE;
      player.isOnGround = false;
      player.canJump = false; // Prevent holding jump for continuous effect
    }
    // Allow jumping again when the key is released
    if (!keysPressed.jump) {
      player.canJump = true;
    }

    // --- Potential Position ---
    let potentialX = player.x + player.vx * deltaTime;
    let potentialY = player.y + player.vy * deltaTime;

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

    // Platforms
    // checkPlatformCollisions needs the player object and deltaTime to predict movement
    // Assuming checkPlatformCollisions resolves position and returns state
    const collisionResult = checkPlatformCollisions(
        playerCollider,
        currentLevel.platforms,
        isInverted,
        deltaTime // Pass deltaTime if the function needs it to resolve
    );

    // Update player state based on platform collision resolution
    player.x = collisionResult.x;
    player.y = collisionResult.y;
    player.isOnGround = collisionResult.bottom; // Assuming 'bottom' means landed on ground
    if (collisionResult.bottom || collisionResult.top) player.vy = 0; // Stop vertical velocity on floor/ceiling hit
    if (collisionResult.left || collisionResult.right) player.vx = 0; // Stop horizontal velocity on wall hit


    // Trampolines (apply after platform resolution)
    // Assuming processTrampolineCollisions modifies the player object passed to it
    // Pass the updated playerCollider state after platform collisions
    playerCollider.x = player.x;
    playerCollider.y = player.y;
    playerCollider.velocityY = player.vy; // Pass current velocity
    processTramplineCollisions( // Corrected typo: processTrampolineCollisions
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
    // Assuming processObstacleCollisions modifies player if collision occurs
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
        player.x = playerCollider.x;
        player.y = playerCollider.y;
        player.vx = 0;
        player.vy = 0;
        player.isOnGround = false; // Reset state
        player.canJump = true;
        // Update render state immediately for reset
        setPlayerRenderState({ ...player });
        return; // Skip rest of the tick after reset
    }


    // Portals (check final position for frame)
    // Assuming processPortalCollisions modifies player if collision occurs
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
    }


    // --- Boundaries ---
    // Apply boundaries to the final resolved position
    if (player.x < 0) player.x = 0;
    if (player.x + PLAYER_SIZE > BASE_GAME_WIDTH) player.x = BASE_GAME_WIDTH - PLAYER_SIZE;
    if (player.y < 0) { player.y = 0; if(player.vy < 0) player.vy = 0; }
    // Optional: Reset if falls too far
    if (player.y > BASE_GAME_HEIGHT + 200) { // Reset if fallen far below screen
        player.x = currentLevel.playerStart.x;
        player.y = currentLevel.playerStart.y;
        player.vx = 0;
        player.vy = 0;
        player.isOnGround = false;
        player.canJump = true;
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