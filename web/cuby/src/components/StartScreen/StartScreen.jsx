import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartContainer, Title, StartButton, GameLogo } from './StartScreen.styles';

const StartScreen = () => {
  const navigate = useNavigate();
  const [isInverted, setIsInverted] = useState(false);
  
  // Manejar cualquier tecla para navegar
  const handleKeyPress = (e) => {
    // Si se pulsa 'c', invertir colores
    if (e.key.toLowerCase() === 'e') {
      setIsInverted(prev => !prev);
    } else {
      // Cualquier otra tecla te lleva a la selección de niveles
      navigate('/levels');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);

  return (
    <StartContainer isInverted={isInverted}>
      <GameLogo isInverted={isInverted}>CUBY</GameLogo>
      <Title isInverted={isInverted}>El juego de las plataformas en blanco y negro</Title>
      <StartButton isInverted={isInverted} onClick={() => navigate('/levels')}>
        Presiona cualquier tecla para comenzar
      </StartButton>
    </StartContainer>
  );
};

export default StartScreen;