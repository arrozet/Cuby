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
    a: false,           // Movimiento a la izquierda
    d: false,           // Movimiento a la derecha
    s: false,           // Agacharse (no implementado aún)
    e: false,           // Invertir colores
    f: false,           // Interactuar
    w: false,           // Saltar
    ' ': false,         // Saltar
    r: false,           // Reiniciar nivel
    arrowleft: false,   // Movimiento a la izquierda (alternativo)
    arrowright: false,  // Movimiento a la derecha (alternativo)
    arrowup: false,     // Saltar (alternativo)
    arrowdown: false    // Agacharse (alternativo, no implementado)
  });


  /**
   * ¿Por qué el array de dependencias está vacío []?
   * 
   * 1. Si pusiéramos [keysPressed], cada vez que se pulse una tecla:
   *    - Se recrearían las funciones handleKeyDown y handleKeyUp
   *    - Se eliminarían y volverían a añadir los event listeners
   *    - Todo esto en cada pulsación, lo cual es ineficiente
   * 
   * 2. No necesitamos [keysPressed] porque:
   *    - Usamos setKeysPressed(prev => ...), donde 'prev' SIEMPRE tiene el valor más reciente
   *    - Es como tener una "línea directa" al último estado sin necesidad de dependencias
   * 
   * Por tanto, los event listeners se crean una vez al inicio y se limpian al final.
   */
  useEffect(() => {
    /**
     * Maneja el evento de tecla presionada
     * @param {KeyboardEvent} event - Evento del teclado
     */
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase(); // Convertir a minúsculas
      // Prevenir el scroll de la página con la barra espaciadora
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      // Actualizar el estado usando el setter funcional para acceder al estado más reciente
      setKeysPressed(prev => 
        prev.hasOwnProperty(key) ? { ...prev, [key]: true } : prev
      );
    };

    /**
     * Maneja el evento de tecla liberada
     * @param {KeyboardEvent} event - Evento del teclado
     */
    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase(); // Convertir a minúsculas
      // Prevenir el scroll de la página con la barra espaciadora
      if (event.key === ' ') {
        event.preventDefault();
      }
      
      // Actualizar el estado usando el setter funcional para acceder al estado más reciente
      setKeysPressed(prev => 
        prev.hasOwnProperty(key) ? { ...prev, [key]: false } : prev
      );
    };

    // Agregar los event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup: remover los event listeners al desmontar
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Sin dependencia a keysPressed ya que usamos el setter funcional

  return keysPressed;
};