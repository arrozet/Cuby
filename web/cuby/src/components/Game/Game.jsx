import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameWrapper } from './Game.styles';
import Controls from '../UI/Control';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useSettings } from '../../context/SettingsContext';
import { useInversion } from '../../context/InversionContext';
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
    isLoading
  );

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
            isLoading={isLoading}            playerRenderState={playerRenderState}
            hasWon={hasWon}
            handleBackToLevels={handleBackToLevels}
            navigateToNextLevel={navigateToNextLevel}
            isLastLevel={isLastLevel()}
            restartGame={restartGame}
          />
          <Controls />
        </>
      )}
    </GameWrapper>
  );
};

export default Game;