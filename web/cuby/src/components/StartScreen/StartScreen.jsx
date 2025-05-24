import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StartContainer, StartButtonContainer } from './StartScreen.styles';
import { useInversion } from '../../context/InversionContext';
import { useSettings } from '../../context/SettingsContext';

const StartScreen = () => {
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  const { keyMapping } = useSettings();
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Manejo de la inversión en esta ventana
  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === keyMapping.invertColors.name.toLowerCase() && !keyPressed) {
      setKeyPressed(true);
      toggleInversion();
    } else if (e.key !== keyMapping.invertColors.name.toLowerCase() && !keyPressed) {
      navigate('/levels');
    }
  }, [navigate, toggleInversion, keyPressed, keyMapping.invertColors.name]);

  const handleKeyUp = useCallback((e) => {
    if (e.key.toLowerCase() === keyMapping.invertColors.name.toLowerCase()) {
      setKeyPressed(false);
    }
  }, [keyMapping.invertColors.name]);

  const handleClick = useCallback(() => {
    navigate('/levels');
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleClick);
    };
  }, [handleKeyDown, handleKeyUp, handleClick]);

  return (
    <StartContainer $isInverted={isInverted}>
      <h1>
        {/*
        <GameTitle 
          text="CUBY"
          fontSize="120px"
          isInverted={!isInverted}
          offset={4}
        />
        */}
        <img 
          src={isInverted ? '/Cuby/images/title_white.webp' : '/Cuby/images/title_black.webp'}
          alt="CUBY"
          style={{
            width: '300px', // Ajusta según tus necesidades
            height: 'auto'
          }}
        />
      </h1>
      <StartButtonContainer $isInverted={isInverted}>
         {/*
        <StartButtonText 
          text="Presiona cualquier botón para comenzar"
          fontSize="20px"
          offset={1}
          isInverted={!isInverted}
        />
        */}
       <img 
          src={isInverted ? '/Cuby/images/presiona_white.webp' : '/Cuby/images/presiona_black.webp'}
          alt="Presiona cualquier botón para comenzar"
          style={{
            width: '300px', // Ajusta según tus necesidades
            height: 'auto'
          }}
        />
      </StartButtonContainer>
    </StartContainer>
  );
};

export default StartScreen;