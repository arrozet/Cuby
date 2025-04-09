import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartContainer, GameTitle, StartButtonContainer, StartButtonText } from './StartScreen.styles';
import { useInversion } from '../../context/InversionContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  
  // Manejo de la inversión en esta ventana
  const handleKeyPress = useCallback((e) => {
    if (e.key.toLowerCase() === 'e') {
      toggleInversion();
    } else {
      navigate('/levels');
    }
  }, [navigate, toggleInversion]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

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