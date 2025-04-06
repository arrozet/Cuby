import { GRAVITY } from '../constants/gameConstants';

export const applyGravity = (velocity, onGround,deltaTime,weight) => {
  if (onGround) {
    return 0;
  }
  return velocity + (GRAVITY *weight)* deltaTime; // Aplica gravedad al jugador
};

export const checkCollision = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

export const checkPlatformCollisions = (player, platforms, isInverted) => {
  // Filtrar plataformas activas
  const activePlatforms = platforms.filter(platform => 
    platform.color === (isInverted ? 'white' : 'black')
  );
  
  let onGround = false;
  let collisions = { top: false, bottom: false, left: false, right: false };

  activePlatforms.forEach(platform => {
    if (checkCollision(player, platform)) {
      // Calcular penetraciones en cada dirección
      const overlapLeft = player.x + player.width - platform.x;
      const overlapRight = platform.x + platform.width - player.x;
      const overlapTop = player.y + player.height - platform.y;
      const overlapBottom = platform.y + platform.height - player.y;
      
      // Encontrar la menor penetración
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
      
      // Resolver basado en la menor penetración
      if (minOverlap === overlapTop && player.velocityY >= 0) {
        // Colisión inferior (aterrizaje)
        player.y = platform.y - player.height;
        player.velocityY = 0;
        onGround = true;
        collisions.bottom = true;
      } 
      else if (minOverlap === overlapBottom && player.velocityY <= 0) {
        // Colisión superior (golpe desde abajo)
        player.y = platform.y + platform.height;
        player.velocityY = 0;
        collisions.top = true;
      }
      else if (minOverlap === overlapLeft && player.velocityX >= 0) {
        // Colisión izquierda
        player.x = platform.x - player.width;
        collisions.right = true;
      }
      else if (minOverlap === overlapRight && player.velocityX <= 0) {
        // Colisión derecha
        player.x = platform.x + platform.width;
        collisions.left = true;
      }
    }
  });

  return { onGround, collisions };
};