import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LevelSelectContainer, 
  Title, 
  LevelsGrid, 
  LevelCard,
  BackButton
} from './LevelSelect.styles';

// Importa todos los niveles disponibles
import { level1 } from '../../levels/level1';

const LevelSelect = () => {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  
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
  
  return (
    <LevelSelectContainer>
      <Title>SELECCIONAR NIVEL</Title>
      <LevelsGrid>
        {levels.map(level => (
          <LevelCard 
            key={level.id} 
            onClick={() => !level.locked && startLevel(level.id)}
            locked={level.locked}
          >
            <div className="level-number">{level.id}</div>
            {level.locked && <div className="lock-icon">🔒</div>}
          </LevelCard>
        ))}
      </LevelsGrid>
      <BackButton onClick={() => navigate('/')}>VOLVER</BackButton>
    </LevelSelectContainer>
  );
};

export default LevelSelect;