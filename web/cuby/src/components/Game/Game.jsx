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
    onGround: false
  });
  const [hasWon, setHasWon] = useState(false);
  const keysPressed = useKeyPress();

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

  const updateGameState = () => { // se ejecuta cada frame
    if (hasWon) return; // si esque ha ganado no hay que hacer nada

    // cambia el estado del jugador
    setPlayerState(prevState => {

      let newState = { ...prevState }; // si no pusieras {...} crearia una referencia y no una copia
      
      // Movimiento horizontal
      newState.velocityX = 0;
      if (keysPressed.a) newState.velocityX -= MOVEMENT_SPEED;
      if (keysPressed.d) newState.velocityX += MOVEMENT_SPEED;
      
      // Jump
      if (keysPressed[' '] && newState.onGround) { // si presiona espacio y esta en el suelo
        newState.velocityY = JUMP_FORCE;
        newState.onGround = false;
      }
      
      // Le aplica la gravedad (physics habria que darle una vueltecilla)
      newState.velocityY = applyGravity(newState.velocityY, newState.onGround);
      
      // Le cambia la posicion en funcion de la velocidad
      newState.x += newState.velocityX; 
      newState.y += newState.velocityY;
      
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
          newState.velocityY = trampoline.force;
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
      onGround: false
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