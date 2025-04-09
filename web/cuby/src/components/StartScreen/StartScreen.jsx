import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartContainer, GameTitle, StartButtonContainer, StartButtonText } from './StartScreen.styles';
import { useInversion } from '../../context/InversionContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Manejo de la inversión en esta ventana
  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === 'e' && !keyPressed) {
      setKeyPressed(true);
      toggleInversion();
    } else if (e.key !== 'e' && !keyPressed) {
      navigate('/levels');
    }
  }, [navigate, toggleInversion, keyPressed]);

  const handleKeyUp = useCallback((e) => {
    if (e.key.toLowerCase() === 'e') {
      setKeyPressed(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <StartContainer isInverted={isInverted}>
      <GameTitle 
        text="CUBY"
        fontSize="120px"
        isInverted={!isInverted}
        offset={4}
      />
      <StartButtonContainer isInverted={isInverted}>
        <StartButtonText 
          text="Presiona cualquier botón para comenzar"
          fontSize="20px"
          offset={1}
          isInverted={!isInverted}
        />
      </StartButtonContainer>
    </StartContainer>
  );
};

export default StartScreen;