import React, { useState, useEffect } from 'react';
import { GameContainer, WinMessage } from './Game.styles';
import Player from '../Player/Player';
import Level from '../Level/Level';
import Controls from '../UI/Control';
import { useGameLoop } from '../../hooks/useGameLoop';
import { useKeyPress } from '../../hooks/useKeyPress';
import { applyGravity, checkPlatformCollisions } from '../../utils/physics';
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE, MOVEMENT_SPEED, JUMP_FORCE } from '../../constants/gameConstants';
import { level1 } from '../../levels/level1';

const Game = () => {
  const [isInverted, setIsInverted] = useState(false);
  const [playerState, setPlayerState] = useState({
    x: 50,
    y: 450,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    weight: 5.0, // peso del jugador
    coyoteTime: 0, // tiempo restante de coyote time
    hasCoyoteJumped: false // para evitar saltos múltiples
    // el coyote time es un tiempo en el que puedes saltar aunque no estes en el suelo
    // lo he metido para que el salto sea mas satisfactorio y permisivo
  });
  const [hasWon, setHasWon] = useState(false);
  const keysPressed = useKeyPress();

  // la ventana
  useEffect(() => {
    const handleResize = () => {
      // Update game dimensions when window is resized
      GAME_WIDTH = window.innerWidth;
      GAME_HEIGHT = window.innerHeight;
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Handle color inversion
  useEffect(() => { // ejecuta cosas 
    if (keysPressed.c) { // esto no es 0% necesario pero bueno
      setIsInverted(prev => !prev); // prev es el valor anterior del estado isInverted
    }
  }, [keysPressed.c]); // esta es la condicion de ejecucción, si no se pone nada se ejecuta cada vez que se renderiza

  // pa reiniciar el juego
  useEffect(() => {
    if (keysPressed.r) {
      restartGame();
    }
  }, [keysPressed.r]);

  const updateGameState = (deltaTime) => { // se ejecuta cada frame
    if (hasWon) return; // si esque ha ganado no hay que hacer nada

    // cambia el estado del jugador
    setPlayerState(prevState => {

      let newState = { ...prevState }; // si no pusieras {...} crearia una referencia y no una copia
      
      const COYOTE_TIME_MAX = 0.06; // yo creo que es un buen tiempo para el coyote time
      // Si está en el suelo, reiniciar el estado de coyote
      if (newState.onGround) {
        newState.coyoteTime = COYOTE_TIME_MAX;
        newState.hasCoyoteJumped = false;
      } else {
        // Restar tiempo si no está en el suelo
        newState.coyoteTime = Math.max(0, newState.coyoteTime - deltaTime);
      }

      // Movimiento horizontal
      newState.velocityX = 0;
      if (keysPressed.a) newState.velocityX -= MOVEMENT_SPEED;
      if (keysPressed.d) newState.velocityX += MOVEMENT_SPEED;
      
      // Jump
      if (keysPressed[' '] && (newState.onGround || (newState.coyoteTime > 0 && !newState.hasCoyoteJumped))) { // si presiona espacio y esta en el suelo
        newState.velocityY = JUMP_FORCE / newState.weight; // le da una fuerza al salto en base al peso
        newState.onGround = false;
        newState.hasCoyoteJumped = true; // Evitar saltos múltiples con coyote time
        newState.coyoteTime = 0; // Consumir el coyote time
      }
      
      // Le aplica la gravedad (physics habria que darle una vueltecilla) // TODO
      newState.velocityY = applyGravity(newState.velocityY, newState.onGround,deltaTime,newState.weight); // le aplica la gravedad al jugador
      
      // Le cambia la posicion en funcion de la velocidad
      newState.x += newState.velocityX * deltaTime; 
      newState.y += newState.velocityY * deltaTime;
      
      // Mira los limites del mapa para que el jugador no se salga
      if (newState.x < 0) newState.x = 0; // no se puede salir por la iquierda
      if (newState.x + newState.width > GAME_WIDTH) newState.x = GAME_WIDTH - newState.width; // ni por la derecha
      if (newState.y < 0) newState.y = 0; // limite superior

      // Límite inferior (suelo): maneja la colisión con el suelo
      if (newState.y + newState.height > GAME_HEIGHT) {
        // Coloca al jugador exactamente en el suelo
        newState.y = GAME_HEIGHT - newState.height;
        // Detiene la caída poniendo la velocidad vertical a 0
        newState.velocityY = 0;
        // Indica que el jugador está en el suelo para permitir el salto
        newState.onGround = true;
      }
      
      // Colisiones (otra vez el pyshics)
      const { onGround, collisions } = checkPlatformCollisions(newState, level1.platforms, isInverted);
      newState.onGround = onGround;
      
      // Check trampoline collisions
      level1.trampolines.forEach(trampoline => {
        if (
          trampoline.color !== (isInverted ? 'black' : 'white') &&
          newState.x < trampoline.x + trampoline.width &&
          newState.x + newState.width > trampoline.x &&
          newState.y + newState.height >= trampoline.y &&
          newState.y + newState.height <= trampoline.y + 10
        ) {
          newState.velocityY = trampoline.force / newState.weight; 
          newState.y = trampoline.y - newState.height;
        }
      });
      
      // Check obstacle collisions (spikes)
      level1.obstacles.forEach(obstacle => {
        if (
          obstacle.color !== (isInverted ? 'black' : 'white') &&
          newState.x < obstacle.x + obstacle.width &&
          newState.x + newState.width > obstacle.x &&
          newState.y + newState.height > obstacle.y &&
          newState.y < obstacle.y + obstacle.height
        ) {
          // Reset player position
          newState.x = 50;
          newState.y = 450;
          newState.velocityX = 0;
          newState.velocityY = 0;
        }
      });
      
      // Check portal collisions
      level1.portals.forEach(portal => {
        if (
          portal.color !== (isInverted ? 'black' : 'white') &&
          newState.x < portal.x + portal.width &&
          newState.x + newState.width > portal.x &&
          newState.y < portal.y + portal.height &&
          newState.y + newState.height > portal.y
        ) {
          // Teleport to destination
          newState.x = portal.destination.x;
          newState.y = portal.destination.y;
          newState.velocityX = 0;
          newState.velocityY = 0;
        }
      });
      
      // Check goal collision
      if (
        newState.x < level1.goal.x + level1.goal.width &&
        newState.x + newState.width > level1.goal.x &&
        newState.y < level1.goal.y + level1.goal.height &&
        newState.y + newState.height > level1.goal.y
      ) {
        setHasWon(true);
      }
      
      return newState;
    });
  };

  useGameLoop(updateGameState); // esto hace que updateGameState se ejecute cada frame

  const restartGame = () => {
    setPlayerState({
      x: 50,
      y: 450,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      weight: 5.0, // peso del jugador
      coyoteTime: 0, // tiempo restante de coyote time
      hasCoyoteJumped: false // para evitar saltos múltiples
    });
    setHasWon(false);
  };

  return (
    <GameContainer width={GAME_WIDTH} height={GAME_HEIGHT}>
      <Level 
        isInverted={isInverted} 
        width={GAME_WIDTH} 
        height={GAME_HEIGHT}
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
          <button onClick={restartGame}>Jugar de nuevo</button>
        </WinMessage>
      )}
    </GameContainer>
  );
};

export default Game;