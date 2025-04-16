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
import ConfirmationModal from '../common/ConfirmationModal/ConfirmationModal'; // Importa el nuevo modal
import { useInversion } from '../../context/InversionContext';
import { getUserLevels, deleteUserLevel } from '../../utils/levelManager';

const UserLevels = () => {
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  const [levels, setLevels] = useState([]);
  const [keyPressed, setKeyPressed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const [levelToDeleteId, setLevelToDeleteId] = useState(null); // Estado para guardar el ID del nivel a eliminar

  useEffect(() => {
    const userLevels = getUserLevels();
    setLevels(userLevels);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key.toLowerCase() === 'e' && !keyPressed) {
      setKeyPressed(true);
      toggleInversion();
    } else if (e.key === 'Escape') {
      // Cierra el modal si está abierto, si no, navega atrás
      if (isModalOpen) {
        closeConfirmationModal();
      } else {
        navigate('/levels');
      }
    }
  }, [navigate, toggleInversion, keyPressed, isModalOpen]); // Añade isModalOpen a las dependencias

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

  // Abre el modal de confirmación en lugar de eliminar directamente
  const handleDeleteLevel = (levelId) => {
    setLevelToDeleteId(levelId); // Guarda el ID del nivel
    setIsModalOpen(true);      // Abre el modal
  };

  // Función que se ejecuta al confirmar la eliminación en el modal
  const confirmDelete = () => {
    if (levelToDeleteId) {
      const success = deleteUserLevel(levelToDeleteId);
      if (success) {
        setLevels(levels.filter(level => level.id !== levelToDeleteId));
      }
    }
    closeConfirmationModal(); // Cierra el modal después de la acción
  };

  // Función para cerrar el modal
  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setLevelToDeleteId(null); // Limpia el ID guardado
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
                {/* Llama a handleDeleteLevel que ahora abre el modal */}
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

      {/* Renderiza el modal de confirmación */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmDelete}
        message="¿Estás seguro de que quieres eliminar este nivel?"
        isInverted={isInverted}
      />
    </UserLevelsContainer>
  );
};

export default UserLevels;