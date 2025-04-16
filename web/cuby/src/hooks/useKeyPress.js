import { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

/**
 * Hook personalizado para detectar y manejar las teclas presionadas
 * 
 * Este hook:
 * - Mantiene un registro del estado de las teclas relevantes para el juego
 * - Previene el comportamiento por defecto de la tecla espacio
 * - Limpia los event listeners automáticamente al desmontar
 * - Utiliza las teclas personalizadas definidas por el usuario
 * 
 * @returns {Object} Un objeto con el estado de cada tecla monitoreada
 *                   donde la clave es el carácter de la tecla y el valor es booleano
 * 
 * @example
 * const keysPressed = useKeyPress();
 * if (keysPressed.left) {
 *   // Mover a la izquierda
 * }
 * if (keysPressed.jump) {
 *   // Saltar
 * }
 */
export const useKeyPress = () => {
  // Obtener la configuración de teclas del usuario
  const { keyMapping } = useSettings();
  
  // Estado inicial con las acciones de juego (en lugar de teclas específicas)
  const [actionPressed, setActionPressed] = useState({
    left: false,
    right: false,
    jump: false,
    crouch: false,
    invertColors: false,
    interact: false,
    restart: false
  });

  useEffect(() => {
    // Genera un mapeo inverso de teclas -> acción para procesar eventos de teclado
    const keyToActionMapping = {};
    
    Object.entries(keyMapping).forEach(([action, keyInfo]) => {
      // Agregamos la tecla a la acción correspondiente
      keyToActionMapping[keyInfo.name.toLowerCase()] = action;
      
      // Manejamos el caso especial de jumpAlt que mapea a la misma acción que jump
      if (action === 'jumpAlt') {
        keyToActionMapping[keyInfo.name.toLowerCase()] = 'jump';
      }
    });
    
    /**
     * Maneja el evento de tecla presionada
     * @param {KeyboardEvent} event - Evento del teclado
     */
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      
      // Prevenir el scroll de la página con la barra espaciadora
      if (key === ' ') {
        event.preventDefault();
      }
      
      // Verificar si la tecla está mapeada a alguna acción
      const action = keyToActionMapping[key];
      if (action) {
        setActionPressed(prev => ({ ...prev, [action]: true }));
      }
    };

    /**
     * Maneja el evento de tecla liberada
     * @param {KeyboardEvent} event - Evento del teclado
     */
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      
      // Prevenir el scroll de la página con la barra espaciadora
      if (key === ' ') {
        event.preventDefault();
      }
      
      // Verificar si la tecla está mapeada a alguna acción
      const action = keyToActionMapping[key];
      if (action) {
        setActionPressed(prev => ({ ...prev, [action]: false }));
      }
    };

    // Agregar los event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup: remover los event listeners al desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keyMapping]); // Dependencia de keyMapping para recrear los listeners cuando las teclas cambien

  // Para mantener compatibilidad con el código existente, también incluimos las teclas originales
  const legacyKeysMapping = {
    a: actionPressed.left,
    d: actionPressed.right,
    w: actionPressed.jump,
    s: actionPressed.crouch,
    e: actionPressed.invertColors,
    f: actionPressed.interact,
    r: actionPressed.restart,
    ' ': actionPressed.jump,
    arrowleft: actionPressed.left,
    arrowright: actionPressed.right,
    arrowup: actionPressed.jump,
    arrowdown: actionPressed.crouch
  };

  return { ...legacyKeysMapping, ...actionPressed };
};