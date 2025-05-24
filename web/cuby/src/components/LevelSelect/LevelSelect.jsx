import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LevelSelectContainer,
  LevelsGrid,
  LevelCard,
  UserLevelsButton
} from './LevelSelect.styles';
import { useInversion } from '../../context/InversionContext';
import { useSettings } from '../../context/SettingsContext';
import BackArrow from '../common/BackArrow/BackArrow';
import SettingsButton from '../common/SettingsButton/SettingsButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Asegúrate de haber instalado esto
import { faLock } from '@fortawesome/free-solid-svg-icons'; // Y esto

// Importa todos los niveles disponibles
import { level1 } from '../../levels/level1';
import { level2 } from '../../levels/level2';
// ... importa más niveles si los tienes

const LevelSelect = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const { isInverted, toggleInversion } = useInversion();
  const { isLevelUnlocked, completedLevels, keyMapping } = useSettings();
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const availableLevelsData = [
      { id: 1, data: level1, name: level1.name, locked: false },
      { id: 2, data: level2, name: level2.name, locked: !isLevelUnlocked(2) },
      // Añade más niveles aquí siguiendo el patrón
      // { id: 3, data: level3, name: level3.name, locked: !isLevelUnlocked(3) },
    ];

    // Filtrar para solo incluir niveles que realmente existen (cuyos datos se importaron)
    const existingLevels = availableLevelsData.filter(level => level.data);
    setLevels(existingLevels);

  }, [completedLevels, isLevelUnlocked]);

  const lastAvailableLevelId = useMemo(() => {
    const unlockedLevels = levels.filter(level => !level.locked);
    if (unlockedLevels.length === 0) {
      return null;
    }
    return Math.max(...unlockedLevels.map(level => level.id));
  }, [levels]);

  const startLevel = (levelId) => {
    navigate(`/game/${levelId}`);
  };

  const handleKeyDown = useCallback((e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return; // No hacer nada si se está escribiendo en un input
    }
    if (e.key.toLowerCase() === keyMapping.invertColors.name.toLowerCase() && !keyPressed) {
      setKeyPressed(true);
      toggleInversion();
    } else if (e.key === 'Escape') {
      navigate('/');
    }
  }, [navigate, toggleInversion, keyPressed, keyMapping.invertColors.name]);

  const handleKeyUp = useCallback((e) => {
    if (e.key.toLowerCase() === keyMapping.invertColors.name.toLowerCase()) {
      setKeyPressed(false);
    }
  }, [keyMapping.invertColors.name]);

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

  const handleUserLevelsClick = () => {
    navigate('/user-levels');
  };

  return (
    <LevelSelectContainer $isInverted={isInverted}>
      <BackArrow onClick={handleBackClick} />
      <SettingsButton />

      <UserLevelsButton
        onClick={handleUserLevelsClick}
        $isInverted={isInverted}
      >
        EDITOR DE <br/>
        NIVELES
      </UserLevelsButton>

      <h1>Selección de nivel</h1> {/* Título añadido */}

      <LevelsGrid>
        {levels.map(level => (
          <LevelCard
            key={level.id}
            onClick={() => !level.locked && startLevel(level.id)}
            $locked={level.locked}
            $isInverted={isInverted}
            $isLastAvailable={!level.locked && level.id === lastAvailableLevelId}
            title={level.locked ? "Nivel bloqueado" : level.name} // Tooltip con el nombre
          >
            <div className="level-number">{level.id}</div>
            {level.locked && (
              <div className="lock-icon">
                <FontAwesomeIcon icon={faLock} />
              </div>
            )}
          </LevelCard>
        ))}
      </LevelsGrid>
    </LevelSelectContainer>
  );
};

export default LevelSelect;