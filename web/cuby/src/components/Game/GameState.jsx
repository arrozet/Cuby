import { useState, useEffect, useCallback } from 'react';
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';

/**
 * Hook para manejar el estado del juego como niveles, carga, victoria, y reinicio
 * 
 * @param {String} levelId - ID del nivel actual
 * @param {Function} navigate - Función de navegación
 * @param {Object} playerStateRef - Referencia al estado del jugador
 * @param {Function} setPlayerRenderState - Función para actualizar el estado del renderizado
 * @returns {Object} - Estados y funciones relacionados con el juego
 */
export const useGameState = (levelId, navigate, playerStateRef, setPlayerRenderState, markLevelAsCompleted) => {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasWon, setHasWon] = useState(false);

  // --- Load Level ---
  useEffect(() => {
    const loadLevel = async () => {
      setIsLoading(true);
      setHasWon(false);
      let levelData;
      const isUserLevel = window.location.hash.includes('/game/user/');

      try {
        if (isUserLevel) {
          // Import dinámico para evitar carga circular o innecesaria
          const { getUserLevelById } = await import('../../utils/levelManager');
          const userLevel = getUserLevelById(levelId);
          if (userLevel) {
            // Reconstruct level objects to ensure methods are available
            levelData = {
              ...userLevel,
              platforms: (userLevel.platforms || []).map(p => p instanceof Platform ? p : new Platform(p)),
              obstacles: (userLevel.obstacles || []).map(o => o instanceof Spike ? o : new Spike(o)),
              trampolines: (userLevel.trampolines || []).map(t => t instanceof Trampoline ? t : new Trampoline(t)),
              portals: (userLevel.portals || []).map(p => p instanceof Portal ? p : new Portal(p)),
              goal: userLevel.goal instanceof Goal ? userLevel.goal : new Goal(userLevel.goal || { x: 700, y: 500 }),
              playerStart: userLevel.playerStart || { x: 50, y: 450 } // Ensure playerStart exists
            };
          } else {
            throw new Error("User level not found");
          }
        } else {
          // Import dinámico para cargar niveles predefinidos
          let levelModule;
          switch (levelId) {
            case '1': 
              levelModule = await import('../../levels/level1'); 
              levelData = levelModule.level1;
              break;
            case '2': 
              levelModule = await import('../../levels/level2');
              levelData = levelModule.level2;
              break;
            default: throw new Error("Predefined level not found");
          }
          // Ensure predefined levels also have playerStart
          if (!levelData.playerStart) {
            levelData.playerStart = { x: 50, y: 450 };
          }
        }

        setCurrentLevel(levelData);
        // Reset player state ref and render state
        playerStateRef.current = {
          ...playerStateRef.current, // Keep weight or other persistent properties if needed
          x: levelData.playerStart.x,
          y: levelData.playerStart.y,
          vx: 0,
          vy: 0,
          isOnGround: false,
          canJump: true, // Reset canJump
          isCrouching: false,
          coyoteTimeCounter: 0, // Reset counters
          jumpBufferCounter: 0,
        };
        setPlayerRenderState(playerStateRef.current);

      } catch (error) {
        console.error("Error loading level:", levelId, error);
        navigate(isUserLevel ? '/user-levels' : '/levels'); // Redirect on error
        return; // Stop execution
      } finally {
        setIsLoading(false);
      }
    };

    loadLevel();
  }, [levelId, navigate, playerStateRef, setPlayerRenderState]);

  // --- Restart Logic ---
  const restartGame = useCallback(() => {
    if (!currentLevel) return;
    // Reset player state ref and render state
    playerStateRef.current = {
      ...playerStateRef.current,
      x: currentLevel.playerStart.x,
      y: currentLevel.playerStart.y,
      vx: 0,
      vy: 0,
      isOnGround: false,
      canJump: true,
      coyoteTimeCounter: 0, // Reset counters on restart
      jumpBufferCounter: 0,
    };
    setPlayerRenderState(playerStateRef.current);
    setHasWon(false);
  }, [currentLevel, playerStateRef, setPlayerRenderState]);

  // --- Navigation ---
  const handleBackToLevels = useCallback(() => {
    const backPath = window.location.hash.includes('/game/user/') ? '/user-levels' : '/levels';
    navigate(backPath);
  }, [navigate]);

  return {
    currentLevel,
    isLoading,
    hasWon,
    setHasWon,
    restartGame,
    handleBackToLevels
  };
};

export default useGameState;
