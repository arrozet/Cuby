import { useState, useCallback, useEffect } from 'react';
import { useInversion } from '../../../context/InversionContext';
import { useSettings } from '../../../context/SettingsContext';

/**
 * Custom hook to handle game controls logic
 * @returns {Object} Controls state and handlers
 */
export const useControls = () => {
  const { isInverted, toggleInversion } = useInversion();
  const { 
    keyMapping, 
    changingControl, 
    startChangingControl,
    errorMessage,
    resetKeyMapping
  } = useSettings();

  const [eKeyPressed, setEKeyPressed] = useState(false);

  const handleKeyClick = useCallback((controlKey) => {
    if (controlKey === 'invertColors') return;
    startChangingControl(controlKey);
  }, [startChangingControl]);

  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === 'e' && !changingControl && !eKeyPressed) {
      setEKeyPressed(true);
      toggleInversion();
    }
  }, [toggleInversion, changingControl, eKeyPressed]);

  const handleKeyUp = useCallback((e) => {
    if (e.key.toLowerCase() === 'e') {
      setEKeyPressed(false);
    }
  }, []);

  useEffect(() => {
    if (!changingControl) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, changingControl]);

  return {
    isInverted,
    keyMapping,
    changingControl,
    errorMessage,
    handleKeyClick,
    resetKeyMapping
  };
}; 