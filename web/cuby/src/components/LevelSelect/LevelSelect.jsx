import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LevelSelectContainer, 
  LevelsGrid, 
  LevelCard,
  BackArrowContainer
} from './LevelSelect.styles';
import { useInversion } from '../../context/InversionContext';

// Importa todos los niveles disponibles
import { level1 } from '../../levels/level1';

const LevelSelect = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const { isInverted, toggleInversion } = useInversion();
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Detectar niveles disponibles
  useEffect(() => {
    // Por ahora solo tenemos level1, pero esto permitirá escalar fácilmente
    const availableLevels = [
      { id: 1, level: level1, name: level1.name, locked: false }
      // AQUI SE PUEDEN AÑADIR MAS NIVELES
      // { id: 2, level: level2, name: level2.name, locked: true },
    ];

    setLevels(availableLevels);
  }, []);
  
  const startLevel = (levelId) => {
    // Por ahora solo navega a una ruta con el ID, pero podrías pasar datos del nivel también
    navigate(`/game/${levelId}`);
  };

  // Manejar la inversión con la tecla E y volver con Escape
  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === 'e' && !keyPressed) {
      setKeyPressed(true);
      toggleInversion();
    } else if (e.key === 'Escape') {
      navigate('/');
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
  
  const handleBackClick = () => {
    navigate('/');
  };
  
  return (
    <LevelSelectContainer isInverted={isInverted}>
      <BackArrowContainer 
        onClick={handleBackClick} 
        isInverted={isInverted}
      >
        <svg width="24" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
          <path d="M1 4H12V1" stroke={isInverted ? "black" : "white"}/>
          <path d="M1.5 4H12.5H16" stroke={isInverted ? "black" : "white"}/>
          <path d="M0.146447 4.35355C-0.0488155 4.15829 -0.0488155 3.84171 0.146447 3.64645L3.32843 0.464466C3.52369 0.269204 3.84027 0.269204 4.03553 0.464466C4.2308 0.659728 4.2308 0.976311 4.03553 1.17157L1.20711 4L4.03553 6.82843C4.2308 7.02369 4.2308 7.34027 4.03553 7.53553C3.84027 7.7308 3.52369 7.7308 3.32843 7.53553L0.146447 4.35355ZM1 4.5H0.5V3.5H1V4.5Z" fill={isInverted ? "black" : "white"}/>
        </svg>
      </BackArrowContainer>
      <LevelsGrid>
        {levels.map(level => (
          <LevelCard 
            key={level.id} 
            onClick={() => !level.locked && startLevel(level.id)}
            locked={level.locked}
            isInverted={isInverted}
          >
            <div className="level-number">{level.id}</div>
            {level.locked && <div className="lock-icon">🔒</div>}
          </LevelCard>
        ))}
      </LevelsGrid>
    </LevelSelectContainer>
  );
};

export default LevelSelect;