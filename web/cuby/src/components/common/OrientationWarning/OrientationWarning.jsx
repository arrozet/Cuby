import React, { useState, useEffect } from 'react';
import { 
  RotateDeviceOverlayContainer, 
  PhoneIconElement, 
  RotateTextElement 
} from './OrientationWarning.styles';

/**
 * Componente para mostrar un aviso de rotación de dispositivo cuando
 * la pantalla está en orientación vertical
 */
const OrientationWarning = () => {
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isPortrait) return null;

  return (
    <RotateDeviceOverlayContainer>
      <RotateTextElement>Gira tu dispositivo</RotateTextElement>
      <PhoneIconElement />
      <RotateTextElement>para poder jugar</RotateTextElement>
    </RotateDeviceOverlayContainer>
  );
};

export default OrientationWarning;