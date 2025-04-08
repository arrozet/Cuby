import { useRef, useEffect, useCallback } from 'react';

/**
 * Hook personalizado que implementa un bucle de juego (game loop)
 * 
 * Este hook proporciona un bucle de animación que:
 * - Se ejecuta en cada frame de animación
 * - Calcula el tiempo transcurrido entre frames (deltaTime)
 * - Limita el deltaTime máximo para evitar problemas con física
 * - Limpia automáticamente los recursos al desmontar el componente
 * 
 * @param {function} callback - Función que se ejecuta en cada frame
 *                             Recibe como parámetro el deltaTime en segundos
 * 
 * @example
 * useGameLoop((deltaTime) => {
 *   // Actualizar la posición de un objeto
 *   position.x += velocity.x * deltaTime;
 * });
 */
export const useGameLoop = (callback) => {
  // Referencia para el ID de requestAnimationFrame
  const requestRef = useRef();
  // Referencia para el timestamp del frame anterior
  const previousTimeRef = useRef();

  // Función de animación estabilizada con useCallback
  const animate = useCallback(time => {
    if (previousTimeRef.current !== undefined) {
      // Convertir el deltaTime a segundos y limitar su valor máximo
      const deltaTime = (time - previousTimeRef.current) / 1000;
      const cappedDeltaTime = Math.min(deltaTime, 0.1); // Evita problemas físicos con frames muy largos. 
      // FPS = 1 / deltaTime = 1 / 0.1 = 10FPS. Si tienes menos de 10 FPS, el juego peta pq está suponiendo que hay 10 FPS al menos
      
      // Ejecutar el callback con el deltaTime
      callback(cappedDeltaTime);
    }
    
    // Actualizar el tiempo del frame anterior
    previousTimeRef.current = time;
    // Programar el siguiente frame
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  // Efecto para iniciar y limpiar el game loop
  useEffect(() => {
    // Iniciar el bucle de animación
    requestRef.current = requestAnimationFrame(animate);
    
    // Cleanup: cancelar la animación al desmontar
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate]);
};