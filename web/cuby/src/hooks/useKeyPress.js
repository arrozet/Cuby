import { useState, useEffect } from 'react';

export const useKeyPress = () => {
  const [keysPressed, setKeysPressed] = useState({
    a: false,
    d: false,
    s: false,
    c: false,
    f: false,
    ' ': false,
    r: false, 
  });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (keysPressed.hasOwnProperty(event.key)) {
        setKeysPressed(prev => ({ ...prev, [event.key]: true }));
      }
    };

    const handleKeyUp = (event) => {
      if (keysPressed.hasOwnProperty(event.key)) {
        setKeysPressed(prev => ({ ...prev, [event.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed]);

  return keysPressed;
};