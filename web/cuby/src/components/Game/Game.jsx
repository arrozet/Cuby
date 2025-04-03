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

  const updateGameState = () => {
    if (hasWon) return;

    setPlayerState(prevState => {
      // Movement and jump logic
      let newState = { ...prevState };
      
      // Horizontal movement
      newState.velocityX = 0;
      if (keysPressed.a) newState.velocityX -= MOVEMENT_SPEED;
      if (keysPressed.d) newState.velocityX += MOVEMENT_SPEED;
      
      // Jump
      if (keysPressed[' '] && newState.onGround) {
        newState.velocityY = JUMP_FORCE;
        newState.onGround = false;
      }
      
      // Apply gravity
      newState.velocityY = applyGravity(newState.velocityY, newState.onGround);
      
      // Update position
      newState.x += newState.velocityX;
      newState.y += newState.velocityY;
      
      // Check world boundaries
      if (newState.x < 0) newState.x = 0;
      if (newState.x + newState.width > GAME_WIDTH) newState.x = GAME_WIDTH - newState.width;
      if (newState.y < 0) newState.y = 0;
      if (newState.y + newState.height > GAME_HEIGHT) {
        newState.y = GAME_HEIGHT - newState.height;
        newState.velocityY = 0;
        newState.onGround = true;
      }
      
      // Check platform collisions
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

  useGameLoop(updateGameState);

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