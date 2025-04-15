import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GameContainer, WinMessage } from './Game.styles';
import Player from '../Player/Player';
import Level from '../Level/Level';
import Controls from '../UI/Control';
import BackArrow from '../common/BackArrow/BackArrow';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress';
import { 
  applyGravity, 
  checkPlatformCollisions,
  processTramplineCollisions,
  processObstacleCollisions,
  processPortalCollisions,
  checkVictoryCondition
} from '../../utils/physics';
import { PLAYER_SIZE, MOVEMENT_SPEED, JUMP_FORCE } from '../../constants/gameConstants';
import { level1 } from '../../levels/level1';
import { level2 } from '../../levels/level2';
import { getUserLevelById } from '../../utils/levelManager';
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
  const [currentLevel, setCurrentLevel] = useState(null);
  // Estados del juego
  const [hasWon, setHasWon] = useState(false);

  /**
   * Estado del jugador que contiene todas sus propiedades físicas y de gameplay
   */
  const [playerState, setPlayerState] = useState({
    x: 50, // Default value until currentLevel is loaded
    y: 450, // Default value until currentLevel is loaded
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

  // Estado para controlar si la tecla E ya fue procesada
  const [eKeyPressed, setEKeyPressed] = useState(false);
  
  // Cargar el nivel correcto basado en la ruta
  useEffect(() => {
    // Verificar si es un nivel de usuario (corregido para funcionar con HashRouter)
    if (window.location.hash.includes('/game/user/')) {
      const userLevel = getUserLevelById(levelId);
      if (userLevel) {
        setCurrentLevel(userLevel);
        setPlayerState(prevState => ({
          ...prevState,
          x: userLevel.playerStart.x,
          y: userLevel.playerStart.y
        }));
      } else {
        // Si no se encuentra, cargar nivel predeterminado
        setCurrentLevel(level1);
        setPlayerState(prevState => ({
          ...prevState,
          x: level1.playerStart.x,
          y: level1.playerStart.y
        }));
      }
    } else {
      // Cargar nivel predeterminado según el ID
      const numericId = Number(levelId);
      let levelToLoad;
      switch(numericId) {
        case 1:
          levelToLoad = level1;
          break;
        case 2:
          levelToLoad = level2;
          break;
        default:
          levelToLoad = level1;
          break;
      }
      setCurrentLevel(levelToLoad);
      setPlayerState(prevState => ({
        ...prevState,
        x: levelToLoad.playerStart.x,
        y: levelToLoad.playerStart.y
      }));
    }
  }, [levelId]);

  /**
   * Reinicia el estado del juego a sus valores iniciales
   */
  const restartGame = useCallback(() => {
    if (currentLevel) {
      setPlayerState(prevState => ({
        ...prevState,
        x: currentLevel.playerStart.x,
        y: currentLevel.playerStart.y,
        velocityX: 0,
        velocityY: 0,
        onGround: false,
        coyoteTime: 0,
        hasCoyoteJumped: false
      }));
      setHasWon(false);
    }
  }, [currentLevel]);

  /**
   * Efecto para manejar la inversión de colores con la tecla 'E'
   */
  useEffect(() => {
    if (keysPressed.e && !eKeyPressed) {
      // Solo invertir si la tecla E acaba de ser presionada
      setEKeyPressed(true);
      toggleInversion();
    } else if (!keysPressed.e && eKeyPressed) {
      // Resetear el estado cuando se suelta la tecla
      setEKeyPressed(false);
    }
  }, [keysPressed.e, toggleInversion, eKeyPressed]);

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
  const updateGameState = useCallback((deltaTime) => {
    if (hasWon || !currentLevel) return;

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
      
      // Procesamiento de colisiones con objetos del juego
      processTramplineCollisions(newState, currentLevel.trampolines, isInverted);
      processObstacleCollisions(newState, currentLevel.obstacles, isInverted, currentLevel.playerStart);
      processPortalCollisions(newState, currentLevel.portals, isInverted);
      
      // Verificación de victoria
      if (checkVictoryCondition(newState, currentLevel.goal)) {
        setHasWon(true);
      }
      
      return newState;
    });
  }, [hasWon, currentLevel, keysPressed, isInverted, gameDimensions.width, gameDimensions.height]);

  /**
   * Maneja el regreso a la pantalla de selección de niveles
   */
  const handleBackToLevels = () => {
    navigate('/levels');
  };

  // Iniciar el bucle del juego
  useGameLoop(updateGameState);

  // Renderizado condicional después de todas las llamadas de hooks
  if (!currentLevel) {
    return <div>Cargando nivel...</div>;
  }

  return (
    <GameContainer width={gameDimensions.width} height={gameDimensions.height}>
      <BackArrow onClick={handleBackToLevels} />
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