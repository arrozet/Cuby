import React, { useState, useEffect } from 'react';
import { GameContainer, WinMessage, GameHeader, LevelTitle, BackArrowContainer } from './Game.styles';
import Player from '../Player/Player';
import Level from '../Level/Level';
import BackArrow from '../common/BackArrow/BackArrow';
import { BASE_GAME_WIDTH, BASE_GAME_HEIGHT, PLAYER_SIZE } from '../../constants/gameConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faRotateRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente para manejar la representación visual del juego
 * 
 * @param {Object} props - Propiedades del componente
 * @returns {JSX.Element} - Elemento JSX del renderizador del juego
 */
const GameRenderer = ({ 
  isInverted,
  currentLevel, 
  isLoading, 
  playerRenderState, 
  hasWon, 
  handleBackToLevels, 
  navigateToNextLevel,
  isLastLevel,
  restartGame
}) => {
  const [scale, setScale] = useState(1); // State for scale factor
  const [gamePos, setGamePos] = useState({ top: 0, left: 0 }); // State for centering offset

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

  // Loading state
  if (isLoading || !currentLevel) {
    return <div>Loading Level...</div>; // Simplified loading view
  }

  return (
    <>
      {/* Header con flecha de volver y título del nivel */}
      <GameHeader>
        <BackArrowContainer>
          <BackArrow onClick={handleBackToLevels} />
        </BackArrowContainer>
        {currentLevel.name && (
          <LevelTitle $isInverted={isInverted}>
            {currentLevel.name}
          </LevelTitle>
        )}
      </GameHeader>
      <GameContainer
        $baseWidth={BASE_GAME_WIDTH}
        $baseHeight={BASE_GAME_HEIGHT}
        $isInverted={isInverted} // Pass inversion for border/bg
        style={{
          transform: `scale(${scale})`,
          top: `${gamePos.top}px`,
          left: `${gamePos.left}px`,
          position: 'absolute', // Position relative to the wrapper
        }}
      >
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
        />        {hasWon && (
          // Pass inversion state to WinMessage for styling
          <WinMessage $isInverted={isInverted}>
            <h2>¡Nivel completado!</h2>
            <div className="buttons-container">
              <button onClick={restartGame}>
                <FontAwesomeIcon icon={faRotateRight} />
                Jugar de nuevo
              </button>
              {/* Solo mostrar el botón de siguiente nivel si NO es el último nivel */}
              {!isLastLevel && (
                <button onClick={navigateToNextLevel}>
                  <FontAwesomeIcon icon={faArrowRight} />
                  Siguiente nivel
                </button>
              )}
            </div>
          </WinMessage>
        )}
      </GameContainer>
    </>
  );
};

export default GameRenderer;
