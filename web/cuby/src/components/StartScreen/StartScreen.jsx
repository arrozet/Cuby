import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartContainer, GameTitle, StartButtonContainer, StartButtonText } from './StartScreen.styles';

const StartScreen = () => {
  const navigate = useNavigate();
  const [isInverted, setIsInverted] = useState(false);
  
  // Manejo de la inveresión en esta ventana
  const handleKeyPress = useCallback((e) => {
    if (e.key.toLowerCase() === 'e') {
      setIsInverted(prev => !prev);
    } else {
      navigate('/levels');
    }
  }, [navigate]);

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
        isInverted={isInverted}
        offset={4}
      />
      <StartButtonContainer isInverted={isInverted}>
        <StartButtonText 
          text="Presiona cualquier botón para comenzar"
          fontSize="20px"
          offset={1}
          isInverted={isInverted}
        />
      </StartButtonContainer>
    </StartContainer>
  );
};

export default StartScreen;