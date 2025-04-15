import { Platform, Spike, Trampoline, Portal, Goal } from '../components/GameElements/GameElements';

// Clave para localStorage
const USER_LEVELS_KEY = 'cuby_user_levels';

/**
 * Obtiene todos los niveles creados por el usuario
 * @returns {Array} Array con los niveles del usuario
 */
export const getUserLevels = () => {
  try {
    const savedLevels = localStorage.getItem(USER_LEVELS_KEY);
    if (savedLevels) {
      return JSON.parse(savedLevels);
    }
  } catch (error) {
    console.error('Error al cargar niveles de usuario:', error);
  }
  
  return [];
};

/**
 * Guarda un nivel creado por el usuario
 * @param {Object} level - Nivel a guardar
 * @param {string} levelId - ID del nivel (opcional, para editar un nivel existente)
 * @returns {string} ID del nivel guardado
 */
export const saveUserLevel = (level, levelId = null) => {
  try {
    const levels = getUserLevels();
    const now = new Date().toISOString();
    
    if (levelId) {
      // Editar nivel existente
      const levelIndex = levels.findIndex(l => l.id === levelId);
      if (levelIndex !== -1) {
        levels[levelIndex] = {
          ...level,
          id: levelId,
          lastModified: now
        };
      }
    } else {
      // Nuevo nivel
      const newLevelId = `user_level_${Date.now()}`;
      levels.push({
        ...level,
        id: newLevelId,
        created: now,
        lastModified: now
      });
      levelId = newLevelId;
    }
    
    localStorage.setItem(USER_LEVELS_KEY, JSON.stringify(levels));
    return levelId;
  } catch (error) {
    console.error('Error al guardar nivel:', error);
    return null;
  }
};

/**
 * Elimina un nivel creado por el usuario
 * @param {string} levelId - ID del nivel a eliminar
 * @returns {boolean} true si se eliminó correctamente
 */
export const deleteUserLevel = (levelId) => {
  try {
    const levels = getUserLevels();
    const filteredLevels = levels.filter(level => level.id !== levelId);
    
    if (filteredLevels.length !== levels.length) {
      localStorage.setItem(USER_LEVELS_KEY, JSON.stringify(filteredLevels));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error al eliminar nivel:', error);
    return false;
  }
};

/**
 * Obtiene un nivel específico
 * @param {string} levelId - ID del nivel a obtener
 * @returns {Object|null} El nivel solicitado o null si no existe
 */
export const getUserLevelById = (levelId) => {
  const levels = getUserLevels();
  const level = levels.find(l => l.id === levelId);
  
  if (level) {
    // Convertir objetos serializados a instancias reales
    return {
      ...level,
      platforms: level.platforms.map(p => new Platform(p)),
      obstacles: level.obstacles.map(o => new Spike(o)),
      trampolines: level.trampolines.map(t => new Trampoline(t)),
      portals: level.portals.map(p => new Portal(p)),
      goal: new Goal(level.goal)
    };
  }
  
  return null;
};

/**
 * Crea un nivel vacío con una estructura básica
 * @returns {Object} Nivel vacío
 */
export const createEmptyLevel = () => {
  return {
    name: "Untitled Level",
    playerStart: {
      x: 50,
      y: 450
    },
    platforms: [
      // Suelo básico
      new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'black' }),
      new Platform({ x: 0, y: 550, width: 800, height: 50, color: 'white' })
    ],
    obstacles: [],
    trampolines: [],
    portals: [],
    goal: new Goal({ x: 700, y: 500 })
  };
};