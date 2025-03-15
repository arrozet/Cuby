import { GRAVITY } from '../constants/gameConstants';

export const applyGravity = (velocity, onGround) => {
  if (onGround) {
    return 0;
  }
  return velocity + GRAVITY;
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
  const activePlatforms = platforms.filter(platform => platform.color !== isInverted);
  let onGround = false;
  let collisions = { top: false, bottom: false, left: false, right: false };

  activePlatforms.forEach(platform => {
    if (checkCollision(player, platform)) {
      // Bottom collision (player lands on platform)
      if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        onGround = true;
        collisions.bottom = true;
      }
      // Top collision (player hits platform from below)
      else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
        player.y = platform.y + platform.height;
        player.velocityY = 0;
        collisions.top = true;
      }
      // Left collision
      else if (player.velocityX > 0 && player.x + player.width - player.velocityX <= platform.x) {
        player.x = platform.x - player.width;
        collisions.right = true;
      }
      // Right collision
      else if (player.velocityX < 0 && player.x - player.velocityX >= platform.x + platform.width) {
        player.x = platform.x + platform.width;
        collisions.left = true;
      }
    }
  });

  return { onGround, collisions };
};