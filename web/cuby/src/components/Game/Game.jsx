import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContainer, WinMessage } from './Game.styles';
import Player from '../Player/Player';
import Level from '../Level/Level';
import Controls from '../UI/Control';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress';
import { applyGravity, checkPlatformCollisions } from '../../utils/physics';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE, MOVEMENT_SPEED, JUMP_FORCE } from '../../constants/gameConstants';
import { level1 } from '../../levels/level1';

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
  
  // Configuración del nivel actual
  const currentLevel = level1; // TODO: Implementar carga dinámica de niveles
  
  // Estados del juego
  const [isInverted, setIsInverted] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  /**
   * Estado del jugador que contiene todas sus propiedades físicas y de gameplay
   */
  const [playerState, setPlayerState] = useState({
    x: 50,                  // Posición X inicial
    y: 450,                 // Posición Y inicial
    width: PLAYER_SIZE,     // Ancho del jugador
    height: PLAYER_SIZE,    // Alto del jugador
    velocityX: 0,          // Velocidad horizontal
    velocityY: 0,          // Velocidad vertical
    onGround: false,       // Indica si el jugador está en el suelo
    weight: 5.0,           // Peso del jugador (afecta a la física)
    coyoteTime: 0,         // Tiempo restante de coyote time
    hasCoyoteJumped: false // Evita múltiples saltos durante el coyote time
  });

  // Hook personalizado para detectar teclas presionadas
  const keysPressed = useKeyPress();

  /**
   * Efecto para manejar la inversión de colores con la tecla 'C'
   */
  useEffect(() => {
    if (keysPressed.c) {
      setIsInverted(prev => !prev);
    }
  }, [keysPressed.c]);

  /**
   * Efecto para manejar el reinicio del juego con la tecla 'R'
   */
  useEffect(() => {
    if (keysPressed.r) {
      restartGame();
    }
  }, [keysPressed.r]);

  /**
   * Efecto para manejar el redimensionamiento de la ventana
   */
  useEffect(() => {
    const handleResize = () => {
      // Actualiza las dimensiones del juego cuando la ventana cambia de tamaño
      GAME_WIDTH = window.innerWidth;
      GAME_HEIGHT = window.innerHeight;
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
      if (keysPressed.a) newState.velocityX -= MOVEMENT_SPEED;
      if (keysPressed.d) newState.velocityX += MOVEMENT_SPEED;
      
      // Procesamiento del salto
      if (keysPressed[' '] && (newState.onGround || (newState.coyoteTime > 0 && !newState.hasCoyoteJumped))) {
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
      newState.x = Math.max(0, Math.min(newState.x, GAME_WIDTH - newState.width));
      newState.y = Math.max(0, newState.y);

      // Colisión con el suelo
      if (newState.y + newState.height > GAME_HEIGHT) {
        newState.y = GAME_HEIGHT - newState.height;
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
        trampoline.color === (isInverted ? 'black' : 'white') &&
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
        obstacle.color === (isInverted ? 'black' : 'white') &&
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
        portal.color === (isInverted ? 'black' : 'white') &&
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
    playerState.x = 50;
    playerState.y = 450;
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

  /**
   * Reinicia el estado del juego a sus valores iniciales
   */
  const restartGame = () => {
    setPlayerState({
      x: 50,
      y: 450,
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
  };

  return (
    <GameContainer width={GAME_WIDTH} height={GAME_HEIGHT}>
      <Level 
        isInverted={isInverted} 
        width={GAME_WIDTH} 
        height={GAME_HEIGHT}
        level={currentLevel}
      />
      <Player 
        x={playerState.x}
        y={playerState.y}
        size={PLAYER_SIZE}
        isInverted={isInverted}
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