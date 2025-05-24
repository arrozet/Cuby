import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const { volume, changeVolume } = useSettings();
  const audioRef = useRef(null);

  // Memoizar el array de tracks para evitar recreación en cada render
  const tracks = useMemo(() => [
    '/Cuby/audio/001101_dreams.mp3',
    '/Cuby/audio/binary_dreams.mp3', 
    '/Cuby/audio/minimalistic_drift.mp3',
    '/Cuby/audio/monochrome_drift.mp3'
  ], []);

  // Inicializar con una pista aleatoria
  const [currentTrack, setCurrentTrack] = useState(() => 
    Math.floor(Math.random() * tracks.length)
  );
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  // Definir handleEnded antes de usarlo
  const handleEnded = useCallback(() => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  }, [tracks.length]);

  // Inicializar audio (SIN establecer volumen aquí)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeEventListener('ended', handleEnded);
    }

    audioRef.current = new Audio(tracks[currentTrack]);
    audioRef.current.loop = false;
    // QUITAR esta línea para evitar la dependencia de volume:
    // audioRef.current.volume = volume;

    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
      }
    };
  }, [currentTrack, tracks, handleEnded]);

  // Efecto separado para establecer el volumen inicial y actualizarlo
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack]); // Añadir currentTrack para que se ejecute cuando cambie la pista


  // Reproducir música con manejo de errores mejorado
  const playMusic = useCallback(() => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setUserHasInteracted(true);
          })
          .catch(error => {
            console.log('Autoplay prevented:', error.message);
            setIsPlaying(false);
            // Si es error de autoplay, esperar interacción del usuario
            if (error.name === 'NotAllowedError') {
              setUserHasInteracted(false);
            }
          });
      }
    }
  }, []);

  // Pausar música
  const pauseMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Cambiar canción
  const changeTrack = useCallback((trackIndex) => {
    if (trackIndex >= 0 && trackIndex < tracks.length) {
      setCurrentTrack(trackIndex);
    }
  }, [tracks.length]);

  const value = {
    isPlaying,
    currentTrack,
    tracks,
    playMusic,
    pauseMusic,
    changeTrack,
    volume,
    changeVolume,
    userHasInteracted
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};