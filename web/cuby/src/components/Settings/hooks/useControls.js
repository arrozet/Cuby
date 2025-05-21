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

  // Ahora cualquier control puede ser cambiado, incluido invertColors
  const handleKeyClick = (controlKey) => {
    startChangingControl(controlKey);
  };

  // Permitir seleccionar un control pulsando la tecla física
  useEffect(() => {
    if (!changingControl && keyMapping) {
      const handleKeyDown = (e) => {
        // Busca el control que tiene asignada la tecla pulsada
        const foundControl = Object.keys(keyMapping).find(
          (control) => keyMapping[control]?.name?.toLowerCase() === e.key.toLowerCase()
        );
        if (foundControl) {
          startChangingControl(foundControl);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [changingControl, keyMapping, startChangingControl]);

  return {
    isInverted,
    keyMapping,
    changingControl,
    errorMessage,
    handleKeyClick,
    resetKeyMapping
  };
}; 