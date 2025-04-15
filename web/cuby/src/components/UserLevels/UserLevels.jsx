import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserLevelsContainer, 
  Title, 
  LevelsList,
  LevelCard,
  ActionButton,
  ButtonContainer,
  NoLevelsMessage
} from './UserLevels.styles';
import BackArrow from '../common/BackArrow/BackArrow';
import { useInversion } from '../../context/InversionContext';
import { getUserLevels, deleteUserLevel } from '../../utils/levelManager';

const UserLevels = () => {
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  const [levels, setLevels] = useState([]);
  const [keyPressed, setKeyPressed] = useState(false);
  
  useEffect(() => {
    // Cargar los niveles del usuario
    const userLevels = getUserLevels();
    setLevels(userLevels);
  }, []);
  
  // Manejar la inversión con la tecla E
  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === 'e' && !keyPressed) {
      setKeyPressed(true);
      toggleInversion();
    } else if (e.key === 'Escape') {
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
  
  const handleCreateLevel = () => {
    navigate('/level-editor/new');
  };
  
  const handleEditLevel = (levelId) => {
    navigate(`/level-editor/${levelId}`);
  };
  
  const handlePlayLevel = (levelId) => {
    navigate(`/game/user/${levelId}`);
  };
  
  const handleDeleteLevel = (levelId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este nivel?')) {
      const success = deleteUserLevel(levelId);
      if (success) {
        // Actualizar la lista de niveles
        setLevels(levels.filter(level => level.id !== levelId));
      }
    }
  };
  
  return (
    <UserLevelsContainer $isInverted={isInverted}>
      <BackArrow onClick={() => navigate('/levels')} />
      <Title $isInverted={isInverted}>Mis Niveles</Title>
      
      <ButtonContainer>
        <ActionButton onClick={handleCreateLevel} $isInverted={isInverted}>
          Crear Nuevo Nivel
        </ActionButton>
      </ButtonContainer>
      
      {levels.length > 0 ? (
        <LevelsList>
          {levels.map(level => (
            <LevelCard key={level.id} $isInverted={isInverted}>
              <h3>{level.name}</h3>
              <p>Creado: {new Date(level.created).toLocaleDateString()}</p>
              <div className="actions">
                <button onClick={() => handlePlayLevel(level.id)}>Jugar</button>
                <button onClick={() => handleEditLevel(level.id)}>Editar</button>
                <button onClick={() => handleDeleteLevel(level.id)}>Eliminar</button>
              </div>
            </LevelCard>
          ))}
        </LevelsList>
      ) : (
        <NoLevelsMessage $isInverted={isInverted}>
          No tienes niveles creados. ¡Crea tu primer nivel!
        </NoLevelsMessage>
      )}
    </UserLevelsContainer>
  );
};

export default UserLevels;