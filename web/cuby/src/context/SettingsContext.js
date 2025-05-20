import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

/**
 * Contexto para almacenar y gestionar las configuraciones del juego
 *
 * Este contexto maneja:
 * - Configuración de volumen
 * - Mapeo de controles (teclas personalizables)
 * - Persistencia de configuración en localStorage
 * - Validación para evitar teclas duplicadas
 * - Seguimiento de niveles completados
 */

// Valores predeterminados para las teclas
const DEFAULT_KEY_MAPPING = {
  jump: { name: 'W', display: 'W' },
  jumpAlt: { name: ' ', display: 'Barra espaciadora' },
  left: { name: 'A', display: 'A' },
  right: { name: 'D', display: 'D' },
  crouch: { name: 'S', display: 'S' },
  interact: { name: 'F', display: 'F' },
  invertColors: { name: 'E', display: 'E' },
  restart: { name: 'R', display: 'R' },
};

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  // Intentar cargar configuraciones desde localStorage o usar valores predeterminados
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('gameVolume');
    return savedVolume !== null ? parseFloat(savedVolume) : 0.5; // Valor predeterminado: 50%
  });
  
  const [keyMapping, setKeyMapping] = useState(() => {
    const savedKeyMapping = localStorage.getItem('gameKeyMapping');
    return savedKeyMapping !== null ? JSON.parse(savedKeyMapping) : DEFAULT_KEY_MAPPING;
  });
  
  // Estado para seguimiento de niveles completados
  const [completedLevels, setCompletedLevels] = useState(() => {
    try {
      const savedCompletedLevels = localStorage.getItem('completedLevels');
      // Asegurarse de que lo que leemos es un array válido
      const parsedLevels = savedCompletedLevels ? JSON.parse(savedCompletedLevels) : null;
      
      if (!Array.isArray(parsedLevels)) {
        // Si no es un array, resetear a los valores predeterminados
        console.warn("Datos de niveles completados inválidos. Reseteando a valores predeterminados.");
        localStorage.setItem('completedLevels', JSON.stringify([]))
        return [];
      }
      return parsedLevels;
    } catch (e) {
      console.error("Error al cargar los niveles completados:", e);
      localStorage.setItem('completedLevels', JSON.stringify([]))
      return [];
    }
  });
  
  const [changingControl, setChangingControl] = useState(null);
  
  // Estado para mostrar mensaje de error cuando una tecla ya está asignada
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Función para cambiar el volumen
  const changeVolume = (newVolume) => {
    setVolume(newVolume);
    // Aquí se agregaría lógica para ajustar el volumen real del juego
    // Por ahora solo guardamos el valor
    localStorage.setItem('gameVolume', newVolume);
  };
  
  // Función para resetear los controles a los valores predeterminados
  const resetKeyMapping = () => {
    setKeyMapping(DEFAULT_KEY_MAPPING);
    localStorage.setItem('gameKeyMapping', JSON.stringify(DEFAULT_KEY_MAPPING));
    setErrorMessage(null); // Limpiar cualquier mensaje de error
    setChangingControl(null); // Cancelar si se estaba cambiando una tecla
    console.log("Controles reseteados a los valores predeterminados.");
  };

  // Función para iniciar el cambio de un control
  const startChangingControl = (controlKey) => {
    // ESC no se puede reasignar a ningún control
    if (controlKey === 'invertColors') return; // E también es especial y no se puede cambiar
    
    // Limpiar cualquier mensaje de error previo
    setErrorMessage(null);
    
    setChangingControl(controlKey);
  };
      // Obtener la descripción de un control para mostrar mensajes de error
  const getControlDescription = useCallback((controlKey) => {
    const descriptions = {
      jump: 'Saltar',
      jumpAlt: 'Saltar (alternativo)',
      left: 'Izquierda',
      right: 'Derecha',
      crouch: 'Agacharse',
      interact: 'Interactuar',
      invertColors: 'Invertir colores',
      restart: 'Reiniciar'
    };
    return descriptions[controlKey] || controlKey;
  }, []);
    // Verificar si una tecla ya está asignada a otro control
  const isKeyAlreadyAssigned = useCallback((key, currentControlKey) => {
    const lowerKey = key.toLowerCase();
    
    // Verificar cada asignación de tecla
    for (const [controlKey, keyInfo] of Object.entries(keyMapping)) {
      // Saltamos el control actual que estamos cambiando
      if (controlKey === currentControlKey) continue;
      
      // Si la tecla ya está asignada a otro control, retornar true
      if (keyInfo.name.toLowerCase() === lowerKey) {
        return controlKey; // Devolvemos la acción a la que está asignada
      }
    }
    
    // La tecla no está asignada a ningún otro control
    return null;
  }, [keyMapping]);
    // Función para asignar una nueva tecla a un control
  const assignNewKey = useCallback((key) => {
    if (!changingControl) return;
    
    // Evitar asignar la tecla ESC o E (invertir colores)
    if (key.toLowerCase() === 'escape') {
      setChangingControl(null);
      return;
    }
    
    if (key.toLowerCase() === 'e' && changingControl !== 'invertColors') {
      setErrorMessage("La tecla 'E' está reservada para invertir colores y no se puede reasignar.");
      setTimeout(() => setErrorMessage(null), 3000); // Limpiar el mensaje después de 3 segundos
      return;
    }
    
    // Verificar si la tecla ya está asignada
    const conflictingControl = isKeyAlreadyAssigned(key, changingControl);
    if (conflictingControl) {
      setErrorMessage(`La tecla '${key.toUpperCase()}' ya está asignada a '${getControlDescription(conflictingControl)}'. Elige otra tecla.`);
      // No limpiamos el mensaje aquí para que el usuario pueda leerlo
      return;
    }
    
    const keyDisplay = key === ' ' ? 'Barra espaciadora' : key.toUpperCase();
    
    // Actualizar el mapeo de teclas
    const updatedKeyMapping = {
      ...keyMapping,
      [changingControl]: { name: key.toLowerCase(), display: keyDisplay }
    };
    
    setKeyMapping(updatedKeyMapping);
    localStorage.setItem('gameKeyMapping', JSON.stringify(updatedKeyMapping));
    setChangingControl(null);
  }, [changingControl, keyMapping, isKeyAlreadyAssigned, getControlDescription]);

    // Cancelar el cambio de control con ESC
  const cancelChangingControl = useCallback(() => {
    setChangingControl(null);
    setErrorMessage(null);
  }, []);
  
  // Eliminar el mensaje de error después de un tiempo
  const clearErrorMessage = () => {
    setErrorMessage(null);
  };
  
  // Marcar un nivel como completado
  const markLevelAsCompleted = (levelId) => {
    console.log(`Marcando nivel ${levelId} como completado`);
    
    setCompletedLevels(prev => {
      // Si el nivel ya está en la lista, devolvemos la misma lista
      if (prev.includes(levelId)) return prev;
      
      // Añadir el nuevo nivel completado a la lista
      const newCompletedLevels = [...prev, levelId];
      
      // Guardar en localStorage
      localStorage.setItem('completedLevels', JSON.stringify(newCompletedLevels));
      
      console.log("Niveles completados actualizados:", newCompletedLevels);
      return newCompletedLevels;
    });
  };
  
  // Verificar si un nivel está desbloqueado
  const isLevelUnlocked = (levelId) => {
    // Convertir a número por seguridad
    const id = Number(levelId);
    
    // El nivel 1 siempre está desbloqueado
    if (id === 1) return true;
    
    // Para que un nivel esté desbloqueado, el nivel anterior debe estar completado
    const previousLevelCompleted = completedLevels.includes(id - 1);
    
    console.log(`Verificando nivel ${id}: El nivel anterior ${id-1} está ${previousLevelCompleted ? "completado" : "no completado"}`);
    console.log("Niveles completados actuales:", completedLevels);
    
    return previousLevelCompleted;
  };
  
  // Resetear los niveles completados (para pruebas)
  const resetCompletedLevels = () => {
    console.log("Reseteando niveles completados");
    localStorage.removeItem('completedLevels'); // Eliminar completamente del localStorage primero
    setCompletedLevels([]);
    localStorage.setItem('completedLevels', JSON.stringify([]));
  };
  
  // Efecto para escuchar teclas cuando estamos cambiando un control
  useEffect(() => {
    if (!changingControl) return;
    
    const handleKeyDown = (e) => {
      e.preventDefault();
      
      if (e.key === 'Escape') {
        cancelChangingControl();
      } else {
        assignNewKey(e.key);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [changingControl, assignNewKey, cancelChangingControl]);
  
  return (
    <SettingsContext.Provider 
      value={{ 
        volume, 
        changeVolume, 
        keyMapping, 
        changingControl, 
        startChangingControl, 
        assignNewKey, 
        cancelChangingControl,
        errorMessage,
        clearErrorMessage,
        completedLevels,
        markLevelAsCompleted,
        isLevelUnlocked,
        resetCompletedLevels,
        resetKeyMapping // Exportar la nueva función
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};