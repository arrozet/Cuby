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
export const processTramplineCollisions = (player, trampolines, isInverted) => {
  trampolines.forEach(trampoline => {
    if (
      isElementActive(trampoline.color, isInverted) &&
      checkCollision(player, trampoline)
    ) {
      player.velocityY = trampoline.force / player.weight;
      player.y = trampoline.y - player.height;
    }
  });
};

/**
 * Detecta las colisiones con obstáculos activos y reinicia la posición
 * del jugador cuando colisiona con alguno
 * 
 * @param {Object} player - Objeto jugador con propiedades x, y, width, height
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
 * @returns {Object} Objeto con el estado de colisión y si está en el suelo
 */
export const checkPlatformCollisions = (player, platforms, isInverted) => {
  // Filtrar solo las plataformas activas según el estado de inversión
  const activePlatforms = platforms.filter(platform => 
    isElementActive(platform.color, isInverted)
  );
  
  let onGround = false;
  let collisions = { 
    top: false,    // Colisión con la parte superior de una plataforma
    bottom: false, // Colisión con la parte inferior (aterrizaje)
    left: false,   // Colisión con el lado izquierdo
    right: false   // Colisión con el lado derecho
  };

  // Verificar colisiones con cada plataforma activa
  activePlatforms.forEach(platform => {
    if (checkCollision(player, platform)) {
      // Calcular la profundidad de penetración en cada dirección
      const overlapLeft = player.x + player.width - platform.x;
      const overlapRight = platform.x + platform.width - player.x;
      const overlapTop = player.y + player.height - platform.y;
      const overlapBottom = platform.y + platform.height - player.y;
      
      // Encontrar la dirección de menor penetración
      const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
      
      // Resolver la colisión según la dirección de menor penetración
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
        // Colisión con el lado izquierdo
        player.x = platform.x - player.width;
        collisions.right = true;
      }
      else if (minOverlap === overlapRight && player.velocityX <= 0) {
        // Colisión con el lado derecho
        player.x = platform.x + platform.width;
        collisions.left = true;
      }
    }
  });

  return { onGround, collisions };
};