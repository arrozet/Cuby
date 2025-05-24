import { useEffect, useCallback } from 'react';
import { useAudio } from '../context/AudioContext';

export const useBackgroundMusic = (shouldPlay = true) => {
  const { playMusic, pauseMusic, isPlaying, userHasInteracted } = useAudio();

  // Función para manejar la primera interacción
  const handleFirstInteraction = useCallback(() => {
    if (shouldPlay && !isPlaying) {
      playMusic();
    }
  }, [shouldPlay, isPlaying, playMusic]);

  useEffect(() => {
    if (shouldPlay) {
      if (userHasInteracted) {
        // Si el usuario ya ha interactuado, reproducir directamente
        if (!isPlaying) {
          playMusic();
        }
      } else {
        // Si no ha interactuado, esperar primera interacción
        const events = ['click', 'keydown', 'touchstart'];
        
        events.forEach(event => {
          document.addEventListener(event, handleFirstInteraction, { once: true });
        });

        return () => {
          events.forEach(event => {
            document.removeEventListener(event, handleFirstInteraction);
          });
        };
      }
    } else {
      pauseMusic();
    }
  }, [shouldPlay, userHasInteracted, isPlaying, playMusic, pauseMusic, handleFirstInteraction]);
};