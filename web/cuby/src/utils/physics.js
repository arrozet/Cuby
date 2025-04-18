import { GRAVITY } from '../constants/gameConstants';
import { isElementActive } from './colors';

/**
 * Aplica la gravedad a un objeto en el juego teniendo en cuenta su peso,
 * si está en el suelo y el tiempo transcurrido
 * 
 * @param {number} velocity - Velocidad vertical actual del objeto
 * @param {boolean} onGround - Indica si el objeto está en el suelo
 * @param {number} deltaTime - Tiempo transcurrido desde el último frame en segundos
 * @param {number} gravityMultiplier - Peso del objeto que afecta cómo la gravedad lo afecta
 * @returns {number} Nueva velocidad vertical después de aplicar la gravedad
 */
export const applyGravity = (velocity, onGround, deltaTime, gravityMultiplier) => {
  if (onGround) {
    return 0; // Si está en el suelo, no hay velocidad vertical
  }
  return velocity + (GRAVITY * gravityMultiplier) * deltaTime; // v = v0 + a * t

  /**
   * En realidad este modelado de la velocidad no es realista, ya que el peso no afecta a la velocidad
   * directamente, aunque tiene sentido usar este modelo aquí; pese a no ser preciso con la realidad
   */
};

/**
 * Verifica si hay colisión entre dos objetos rectangulares con el 
 * algoritmo de detección de colisiones AABB (Axis-Aligned Bounding Box)
 * 
 * @param {Object} obj1 - Primer objeto con propiedades x, y, width, height
 * @param {Object} obj2 - Segundo objeto con propiedades x, y, width, height
 * @returns {boolean} true si hay colisión, false si no
 */
export const checkCollision = (obj1, obj2) => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

/**
 * Detecta y procesa las colisiones entre el jugador y los trampolines activos.
 * Cuando hay colisión, aplica un impulso vertical al jugador basado en la fuerza del trampolín
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, width, height, velocityY, weight
 * @param {Array} trampolines - Array de trampolines con propiedades x, y, width, height, color, force
 * @param {boolean} isInverted - Estado actual de inversión de color
 */
export const processTrampolineCollisions = (player, trampolines, isInverted) => {
  trampolines.forEach(trampoline => {
    if (
      isElementActive(trampoline.color, isInverted) &&
      checkCollision(player, trampoline)
    ) {
      // Check if player is landing on top (moving down or still, and bottom is near top)
      const playerBottom = player.y + player.height;
      const trampolineTop = trampoline.y;
      // Small tolerance to ensure contact
      const tolerance = 5; 
      if (player.velocityY >= 0 && playerBottom >= trampolineTop && playerBottom <= trampolineTop + tolerance) {
        player.velocityY = trampoline.force / player.weight;
        // Optional: Snap player position to top of trampoline
        // player.y = trampoline.y - player.height; 
        // Note: Be cautious with direct position manipulation if it conflicts with platform collision
      }
    }
  });
};

/**
 * Detecta las colisiones con obstáculos activos y reinicia la posición
 * del jugador cuando colisiona con alguno
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, width, height, velocityY
 * @param {Array} obstacles - Array de obstáculos con propiedades x, y, width, height, color
 * @param {boolean} isInverted - Estado actual de inversión de color
 * @param {Object} startPosition - Posición inicial del jugador con propiedades x, y
 */
export const processObstacleCollisions = (player, obstacles, isInverted, startPosition) => {
  obstacles.forEach(obstacle => {
    if (
      isElementActive(obstacle.color, isInverted) &&
      checkCollision(player, obstacle)
    ) {
      resetPlayerPosition(player, startPosition);
    }
  });
};

/**
 * Maneja las colisiones con portales activos, teletransportando al jugador
 * a la posición de destino del portal cuando hay contacto
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, width, height
 * @param {Array} portals - Array de portales con propiedades x, y, width, height, color, destination
 * @param {boolean} isInverted - Estado actual de inversión de color
 */
export const processPortalCollisions = (player, portals, isInverted) => {
  portals.forEach(portal => {
    if (
      isElementActive(portal.color, isInverted) &&
      checkCollision(player, portal)
    ) {
      teleportPlayer(player, portal.destination);
    }
  });
};

/**
 * Verifica si el jugador ha alcanzado la meta del nivel
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, width, height
 * @param {Object} goal - Objeto meta con propiedades x, y, width, height
 * @returns {boolean} true si el jugador ha alcanzado la meta, false si no
 */
export const checkVictoryCondition = (player, goal) => {
  return checkCollision(player, goal);
};

/**
 * Reinicia la posición y velocidad del jugador a su estado inicial
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, velocityX, velocityY
 * @param {Object} startPosition - Posición inicial del jugador con propiedades x, y
 */
const resetPlayerPosition = (player, startPosition) => {
  player.x = startPosition.x;
  player.y = startPosition.y;
  player.velocityX = 0;
  player.velocityY = 0;
};

/**
 * Mueve instantáneamente al jugador a una nueva posición y detiene su velocidad
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, velocityX, velocityY
 * @param {Object} destination - Posición de destino con propiedades x, y
 */
const teleportPlayer = (player, destination) => {
  player.x = destination.x;
  player.y = destination.y;
  player.velocityX = 0;
  player.velocityY = 0;
};

/**
 * Sistema de detección y resolución de colisiones con plataformas que:
 * - Maneja colisiones en todas las direcciones
 * - Considera solo plataformas activas según el estado de inversión
 * - Resuelve las colisiones moviendo al jugador a la posición correcta
 * - Actualiza el estado de "en el suelo" del jugador
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, width, height, velocityX, velocityY
 * @param {Array} platforms - Array de plataformas con propiedades x, y, width, height, color
 * @param {boolean} isInverted - Estado actual de inversión de color
 * @param {number} deltaTime - Tiempo transcurrido desde el último frame en segundos
 * @returns {Object} Objeto con la posición resuelta (x, y) y el estado de colisión (top, bottom, left, right)
 */
export const checkPlatformCollisions = (player, platforms, isInverted, deltaTime) => {
  // Filtrar solo las plataformas activas según el estado de inversión
  const activePlatforms = platforms.filter(platform =>
    isElementActive(platform.color, isInverted)
  );

  let resolvedX = player.x + player.velocityX * deltaTime;
  let resolvedY = player.y + player.velocityY * deltaTime;
  let collisionState = {
    top: false,
    bottom: false,
    left: false,
    right: false
  };

  // Helper function to check collision between two AABBs
  const checkAABBCollision = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  };

  // --- Vertical Collision Check ---
  let verticalCollider = { ...player, y: resolvedY }; // Check potential vertical position
  for (const platform of activePlatforms) {
    if (checkAABBCollision(verticalCollider, platform)) {
      if (player.velocityY > 0) { // Moving down
        // Landed on top of the platform
        resolvedY = platform.y - player.height;
        collisionState.bottom = true;
      } else if (player.velocityY < 0) { // Moving up
        // Hit bottom of the platform
        resolvedY = platform.y + platform.height;
        collisionState.top = true;
      }
      // Velocity reset is handled in the game loop based on collisionState
      verticalCollider.y = resolvedY; // Update collider for subsequent checks in this loop if needed
    }
  }

  // --- Horizontal Collision Check ---
  let horizontalCollider = { ...player, x: resolvedX, y: resolvedY }; // Check potential horizontal position *after* vertical resolution
  for (const platform of activePlatforms) {
    if (checkAABBCollision(horizontalCollider, platform)) {
      if (player.velocityX > 0) { // Moving right
        // Hit left side of the platform
        resolvedX = platform.x - player.width;
        collisionState.right = true;
      } else if (player.velocityX < 0) { // Moving left
        // Hit right side of the platform
        resolvedX = platform.x + platform.width;
        collisionState.left = true;
      }
       // Velocity reset is handled in the game loop based on collisionState
       horizontalCollider.x = resolvedX; // Update collider for subsequent checks
    }
  }

  // Return the resolved position and collision flags
  return {
    x: resolvedX,
    y: resolvedY,
    ...collisionState // Spread the collision flags (top, bottom, left, right)
  };
};