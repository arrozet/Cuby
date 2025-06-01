import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameWrapper } from './Game.styles';
import Controls from '../UI/Control';
import MobileControls from '../MobileControls/MobileControls';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useSettings } from '../../context/SettingsContext';
import { useInversion } from '../../context/InversionContext';
import { MOVEMENT_SPEED, JUMP_BUFFER_DURATION } from '../../constants/gameConstants';
// Import our new components
import useGamePhysics from './GamePhysics';
import useGameState from './GameState';
import GameRenderer from './GameRenderer';

/** 
 * Game Component - El componente principal del juego que maneja la lógica del gameplay
 *
 * Este componente coordina los subcomponentes:
 * - GamePhysics: Maneja la física y colisiones
 * - GameState: Gestiona el estado del juego (victoria, carga, etc.)
 * - GameRenderer: Maneja la representación visual
 *
 * @component
 */
const Game = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  const prevInvertKeyPressed = useRef(false); // Ref to track previous invert key state
  const { markLevelAsCompleted } = useSettings();
  
  // --- Player State ---
  // Store player state in a ref for direct access in game loop
  const playerStateRef = useRef({
    x: 50, y: 450, vx: 0, vy: 0, isOnGround: false, canJump: true, isCrouching: false, weight: 1,
    coyoteTimeCounter: 0,
    jumpBufferCounter: 0,
  });
  // State for React rendering
  const [playerRenderState, setPlayerRenderState] = useState(playerStateRef.current);

  // --- Game State Management ---
  // Use GameState hook to manage loading levels, winning, and restarting
  const {
    currentLevel,
    isLoading,
    hasWon,
    setHasWon,
    restartGame,
    handleBackToLevels,
    navigateToNextLevel,
    isLastLevel
  } = useGameState(levelId, navigate, playerStateRef, setPlayerRenderState, markLevelAsCompleted);

  // --- Input Handling ---
  const keysPressed = useKeyPress();

  // --- Handle Inversion Input ---
  useEffect(() => {
    // Toggle inversion only when the key is pressed down (transition from false to true)
    if (keysPressed.invertColors && !prevInvertKeyPressed.current) {
      toggleInversion();
    }
    // Update the previous state for the next render
    prevInvertKeyPressed.current = keysPressed.invertColors;
  }, [keysPressed.invertColors, toggleInversion]);

  // --- Mobile Controls Handlers ---
  const handleLeftPress = () => {
    if (!hasWon && !isLoading) {
      playerStateRef.current.vx = -MOVEMENT_SPEED;
      setPlayerRenderState(prevState => ({
        ...prevState,
        vx: -MOVEMENT_SPEED
      }));
    }
  };

  const handleRightPress = () => {
    if (!hasWon && !isLoading) {
      playerStateRef.current.vx = MOVEMENT_SPEED;
      setPlayerRenderState(prevState => ({
        ...prevState,
        vx: MOVEMENT_SPEED
      }));
    }
  };

  const handleJumpPress = () => {
    if (!hasWon && !isLoading) {
      playerStateRef.current.jumpBufferCounter = JUMP_BUFFER_DURATION;
      setPlayerRenderState(prevState => ({
        ...prevState,
        jumpBufferCounter: JUMP_BUFFER_DURATION
      }));
    }
  };

  const handleColorPress = () => {
    if (!hasWon && !isLoading) {
      toggleInversion();
    }
  };

  // --- Reset Movement on Touch End ---
  const handleLeftTouchEnd = () => {
    if (!hasWon && !isLoading) {
      // Solo resetear la velocidad si no hay otro botón de movimiento presionado
      if (playerStateRef.current.vx === -MOVEMENT_SPEED) {
        playerStateRef.current.vx = 0;
        setPlayerRenderState(prevState => ({
          ...prevState,
          vx: 0
        }));
      }
    }
  };

  const handleRightTouchEnd = () => {
    if (!hasWon && !isLoading) {
      // Solo resetear la velocidad si no hay otro botón de movimiento presionado
      if (playerStateRef.current.vx === MOVEMENT_SPEED) {
        playerStateRef.current.vx = 0;
        setPlayerRenderState(prevState => ({
          ...prevState,
          vx: 0
        }));
      }
    }
  };

  // --- Handle Key Release ---
  useEffect(() => {
    const handleKeyUp = (e) => {
      if (!hasWon && !isLoading) {
        if (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'd' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          // Solo resetear la velocidad si no hay otra tecla de movimiento presionada
          const isLeftKey = e.key.toLowerCase() === 'a' || e.key === 'ArrowLeft';
          const isRightKey = e.key.toLowerCase() === 'd' || e.key === 'ArrowRight';
          
          if ((isLeftKey && playerStateRef.current.vx === -MOVEMENT_SPEED) ||
              (isRightKey && playerStateRef.current.vx === MOVEMENT_SPEED)) {
            playerStateRef.current.vx = 0;
            setPlayerRenderState(prevState => ({
              ...prevState,
              vx: 0
            }));
          }
        }
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, [hasWon, isLoading]);

  // --- Game Physics ---
  // Use GamePhysics hook to handle all game physics and collisions
  const gamePhysicsTick = useGamePhysics(
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
    (x, y) => {
      // Esta función se llamará cuando el jugador muera
      if (playerDeathHandler.current) {
        playerDeathHandler.current(x, y);
      }
    }
  );

  // Referencia para almacenar el manejador de muerte
  const playerDeathHandler = useRef(null);

  // --- Restart on keypress ---
  useEffect(() => {
    if (keysPressed.restart) {
      restartGame();
    }
  }, [keysPressed.restart, restartGame]);

  // Start the game loop
  useGameLoop(gamePhysicsTick);

  // --- Render ---
  return (
    <GameWrapper $isInverted={isInverted}>
      {isLoading || !currentLevel ? (
        <div>Loading Level...</div>
      ) : (
        <>
          <GameRenderer
            isInverted={isInverted}
            currentLevel={currentLevel}
            isLoading={isLoading}
            playerRenderState={playerRenderState}
            hasWon={hasWon}
            handleBackToLevels={handleBackToLevels}
            navigateToNextLevel={navigateToNextLevel}
            isLastLevel={isLastLevel()}
            restartGame={restartGame}
            onPlayerDeath={(handler) => {
              playerDeathHandler.current = handler;
            }}
          />
          <Controls />
          <MobileControls
            onLeftPress={handleLeftPress}
            onRightPress={handleRightPress}
            onJumpPress={handleJumpPress}
            onColorPress={handleColorPress}
            onLeftTouchEnd={handleLeftTouchEnd}
            onRightTouchEnd={handleRightTouchEnd}
            isInverted={isInverted}
          />
        </>
      )}
    </GameWrapper>
  );
};

export default Game;