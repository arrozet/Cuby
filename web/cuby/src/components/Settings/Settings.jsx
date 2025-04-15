import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContainer, SettingsContent, Title, Message } from './Settings.styles';
import { useInversion } from '../../context/InversionContext';
import BackArrow from '../common/BackArrow/BackArrow';

/**
 * Componente Settings - Pantalla de configuración del juego
 * 
 * Por ahora solo muestra un mensaje de "POR IMPLEMENTAR"
 * 
 * @component
 */
const Settings = () => {
  const navigate = useNavigate();
  const { isInverted } = useInversion();
  
  const handleBack = () => {
    navigate('/levels');
  };
  
  return (
    <SettingsContainer $isInverted={isInverted}>
      <BackArrow onClick={handleBack} />
      <SettingsContent>
        <Title $isInverted={isInverted}>Configuración</Title>
        <Message $isInverted={isInverted}>POR IMPLEMENTAR</Message>
      </SettingsContent>
    </SettingsContainer>
  );
};

export default Settings;