import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContainer, WinMessage } from './Game.styles';
import Player from '../Player/Player';
import Level from '../Level/Level';
import Controls from '../UI/Control';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress';
import { applyGravity, checkPlatformCollisions } from '../../utils/physics';
import { isElementActive } from '../../utils/colors';
import { PLAYER_SIZE, MOVEMENT_SPEED, JUMP_FORCE } from '../../constants/gameConstants';
import { level1 } from '../../levels/level1';
import { useInversion } from '../../context/InversionContext';

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
  
  // Usar el contexto global de inversión
  const { isInverted, toggleInversion } = useInversion();
  
  // Estado para las dimensiones del juego (responsive)
  const [gameDimensions, setGameDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Configuración del nivel actual
  const currentLevel = level1; // TODO: Implementar carga dinámica de niveles
  
  // Estados del juego
  const [hasWon, setHasWon] = useState(false);

  /**
   * Estado del jugador que contiene todas sus propiedades físicas y de gameplay
   */
  const [playerState, setPlayerState] = useState({
    x: currentLevel.playerStart.x,
    y: currentLevel.playerStart.y,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    weight: 5.0,
    coyoteTime: 0,
    hasCoyoteJumped: false
  });

  // Hook personalizado para detectar teclas presionadas
  const keysPressed = useKeyPress();

  /**
   * Reinicia el estado del juego a sus valores iniciales
   */
  const restartGame = useCallback(() => {
    setPlayerState({
      x: currentLevel.playerStart.x,
      y: currentLevel.playerStart.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      weight: 5.0,
      coyoteTime: 0,
      hasCoyoteJumped: false
    });
    setHasWon(false);
  }, [currentLevel]);

  /**
   * Efecto para manejar la inversión de colores con la tecla 'E'
   */
  useEffect(() => {
    if (keysPressed.e) {
      // Usar toggleInversion del contexto global
      toggleInversion();
    }
  }, [keysPressed.e, toggleInversion]);

  /**
   * Efecto para manejar el reinicio del juego con la tecla 'R'
   */
  useEffect(() => {
    if (keysPressed.r) {
      restartGame();
    }
  }, [keysPressed.r, restartGame]);

  /**
   * Efecto para manejar el redimensionamiento de la ventana
   */
  useEffect(() => {
    const handleResize = () => {
      // Actualiza las dimensiones del juego cuando la ventana cambia de tamaño
      setGameDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Actualiza el estado del juego en cada frame
   * @param {number} deltaTime - Tiempo transcurrido desde el último frame en segundos
   */
  const updateGameState = (deltaTime) => {
    if (hasWon) return;

    setPlayerState(prevState => {
      const newState = { ...prevState };
      
      // Gestión del Coyote Time (tiempo extra para saltar después de caer)
      const COYOTE_TIME_MAX = 0.06;
      if (newState.onGround) {
        newState.coyoteTime = COYOTE_TIME_MAX;
        newState.hasCoyoteJumped = false;
      } else {
        newState.coyoteTime = Math.max(0, newState.coyoteTime - deltaTime);
      }

      // Procesamiento del movimiento horizontal
      newState.velocityX = 0;
      if (keysPressed.a || keysPressed.arrowleft) {
        newState.velocityX = -MOVEMENT_SPEED;
      }
      if (keysPressed.d || keysPressed.arrowright) {
        newState.velocityX = MOVEMENT_SPEED;
      }
      
      // Procesamiento del salto
      if ((keysPressed[' '] || keysPressed.w || keysPressed.arrowup) && 
          (newState.onGround || (newState.coyoteTime > 0 && !newState.hasCoyoteJumped))) {
        newState.velocityY = JUMP_FORCE / newState.weight;
        newState.onGround = false;
        newState.hasCoyoteJumped = true;
        newState.coyoteTime = 0;
      }
      
      // Aplicación de la física
      newState.velocityY = applyGravity(newState.velocityY, newState.onGround, deltaTime, newState.weight);
      newState.x += newState.velocityX * deltaTime;
      newState.y += newState.velocityY * deltaTime;
      
      // Restricciones de los límites del mundo
      newState.x = Math.max(0, Math.min(newState.x, gameDimensions.width - newState.width));
      newState.y = Math.max(0, newState.y);

      // Colisión con el suelo
      if (newState.y + newState.height > gameDimensions.height) {
        newState.y = gameDimensions.height - newState.height;
        newState.velocityY = 0;
        newState.onGround = true;
      }
      
      // Procesamiento de colisiones con plataformas
      const { onGround } = checkPlatformCollisions(newState, currentLevel.platforms, isInverted);
      newState.onGround = onGround;
      
      // Procesamiento de colisiones con trampolines
      processTramplineCollisions(newState, currentLevel.trampolines);
      
      // Procesamiento de colisiones con obstáculos
      processObstacleCollisions(newState, currentLevel.obstacles);
      
      // Procesamiento de colisiones con portales
      processPortalCollisions(newState, currentLevel.portals);
      
      // Verificación de victoria
      checkVictoryCondition(newState, currentLevel.goal);
      
      return newState;
    });
  };

  /**
   * Procesa las colisiones con trampolines
   */
  const processTramplineCollisions = (playerState, trampolines) => {
    trampolines.forEach(trampoline => {
      if (
        isElementActive(trampoline.color, isInverted) &&
        checkCollisionWithObject(playerState, trampoline)
      ) {
        playerState.velocityY = trampoline.force / playerState.weight;
        playerState.y = trampoline.y - playerState.height;
      }
    });
  };

  /**
   * Procesa las colisiones con obstáculos
   */
  const processObstacleCollisions = (playerState, obstacles) => {
    obstacles.forEach(obstacle => {
      if (
        isElementActive(obstacle.color, isInverted) &&
        checkCollisionWithObject(playerState, obstacle)
      ) {
        resetPlayerPosition(playerState);
      }
    });
  };

  /**
   * Procesa las colisiones con portales
   */
  const processPortalCollisions = (playerState, portals) => {
    portals.forEach(portal => {
      if (
        isElementActive(portal.color, isInverted) &&
        checkCollisionWithObject(playerState, portal)
      ) {
        teleportPlayer(playerState, portal.destination);
      }
    });
  };

  /**
   * Verifica si se ha alcanzado la condición de victoria
   */
  const checkVictoryCondition = (playerState, goal) => {
    if (checkCollisionWithObject(playerState, goal)) {
      setHasWon(true);
    }
  };

  /**
   * Verifica colisión entre el jugador y un objeto
   */
  const checkCollisionWithObject = (player, object) => {
    return (
      player.x < object.x + object.width &&
      player.x + player.width > object.x &&
      player.y < object.y + object.height &&
      player.y + player.height > object.y
    );
  };

  /**
   * Reinicia la posición del jugador
   */
  const resetPlayerPosition = (playerState) => {
    playerState.x = currentLevel.playerStart.x;
    playerState.y = currentLevel.playerStart.y;
    playerState.velocityX = 0;
    playerState.velocityY = 0;
  };

  /**
   * Teletransporta al jugador a una nueva posición
   */
  const teleportPlayer = (playerState, destination) => {
    playerState.x = destination.x;
    playerState.y = destination.y;
    playerState.velocityX = 0;
    playerState.velocityY = 0;
  };

  // Iniciar el bucle del juego
  useGameLoop(updateGameState);

  return (
    <GameContainer width={gameDimensions.width} height={gameDimensions.height}>
      <Level 
        width={gameDimensions.width} 
        height={gameDimensions.height}
        level={currentLevel}
      />
      <Player 
        x={playerState.x}
        y={playerState.y}
        size={PLAYER_SIZE}
      />
      <Controls />
      
      {hasWon && (
        <WinMessage>
          <h2>¡Nivel completado!</h2>
          <button onClick={() => navigate('/levels')}>Seleccionar nivel</button>
          <button onClick={restartGame}>Jugar de nuevo</button>
        </WinMessage>
      )}
    </GameContainer>
  );
};

export default Game;