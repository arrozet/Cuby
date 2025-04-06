import { useRef, useEffect, useCallback } from 'react';

export const useGameLoop = (callback) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  // Usar useCallback para estabilizar la función animate
  const animate = useCallback(time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = (time - previousTimeRef.current) / 1000; // Convertir a segundos (mola mas manejarlo)
      const cappedDeltaTime = Math.min(deltaTime, 0.1);
      callback(cappedDeltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]); // Ahora animate es estable gracias a useCallback
};