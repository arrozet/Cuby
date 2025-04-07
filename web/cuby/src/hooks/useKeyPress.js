import { useState, useEffect } from 'react';

/**
 * Hook personalizado para detectar y manejar las teclas presionadas
 * 
 * Este hook:
 * - Mantiene un registro del estado de las teclas relevantes para el juego
 * - Previene el comportamiento por defecto de la tecla espacio
 * - Limpia los event listeners automáticamente al desmontar
 * 
 * @returns {Object} Un objeto con el estado de cada tecla monitoreada
 *                   donde la clave es el carácter de la tecla y el valor es booleano
 * 
 * @example
 * const keysPressed = useKeyPress();
 * if (keysPressed.a) {
 *   // Mover a la izquierda
 * }
 * if (keysPressed[' ']) {
 *   // Saltar
 * }
 */
export const useKeyPress = () => {
  // Estado inicial de las teclas monitoreadas
  const [keysPressed, setKeysPressed] = useState({
    a: false,     // Movimiento a la izquierda
    d: false,     // Movimiento a la derecha
    s: false,     // Agacharse (no implementado aún)
    c: false,     // Invertir colores
    f: false,     // Acción futura
    ' ': false,   // Saltar
    r: false,     // Reiniciar nivel
  });

  useEffect(() => {
    /**
     * Maneja el evento de tecla presionada
     * @param {KeyboardEvent} event - Evento del teclado
     */
    const handleKeyDown = (event) => {
      // Prevenir el scroll de la página con la barra espaciadora
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      // Actualizar el estado solo si la tecla está siendo monitoreada
      if (keysPressed.hasOwnProperty(event.key)) {
        setKeysPressed(prev => ({ ...prev, [event.key]: true }));
      }
    };

    /**
     * Maneja el evento de tecla liberada
     * @param {KeyboardEvent} event - Evento del teclado
     */
    const handleKeyUp = (event) => {
      // Prevenir el scroll de la página con la barra espaciadora
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      // Actualizar el estado solo si la tecla está siendo monitoreada
      if (keysPressed.hasOwnProperty(event.key)) {
        setKeysPressed(prev => ({ ...prev, [event.key]: false }));
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
  }, [keysPressed]); // Dependencia necesaria para acceder a keysPressed.hasOwnProperty

  return keysPressed;
};