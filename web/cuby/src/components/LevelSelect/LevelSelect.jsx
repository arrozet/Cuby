import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LevelSelectContainer, 
  LevelsGrid, 
  LevelCard,
  UserLevelsButton
} from './LevelSelect.styles';
import { useInversion } from '../../context/InversionContext';
import BackArrow from '../common/BackArrow/BackArrow';
import SettingsButton from '../common/SettingsButton/SettingsButton';

// Importa todos los niveles disponibles
import { level1 } from '../../levels/level1';
import { level2 } from '../../levels/level2';

const LevelSelect = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const { isInverted, toggleInversion } = useInversion();
  const [keyPressed, setKeyPressed] = useState(false);
  
  // Detectar niveles disponibles
  useEffect(() => {
    // Por ahora solo tenemos level1, pero esto permitirá escalar fácilmente
    const availableLevels = [
      { id: 1, level: level1, name: level1.name, locked: false },
      // AQUI SE PUEDEN AÑADIR MAS NIVELES
      { id: 2, level: level2, name: level2.name, locked: false } // TODO: SISTEMA DE DESBLOQUEO DE NIVELES
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
  
  // Nuevo handler para navegar a "Mis Niveles"
  const handleUserLevelsClick = () => {
    navigate('/user-levels');
  };
  
  return (
    <LevelSelectContainer $isInverted={isInverted}>
      <BackArrow onClick={handleBackClick} />
      <SettingsButton />
      
      {/* Botón para Mis Niveles */}
      <UserLevelsButton 
        onClick={handleUserLevelsClick}
        $isInverted={isInverted}
      >
        MIS NIVELES
      </UserLevelsButton>
      
      <LevelsGrid>
        {levels.map(level => (
          <LevelCard 
            key={level.id} 
            onClick={() => !level.locked && startLevel(level.id)}
            locked={level.locked}
            $isInverted={isInverted}
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