import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SettingsContainer, 
  SettingsContent, 
  Title,
  Section,
  SectionTitle,
  VolumeSlider,
} from './Settings.styles';
import { useInversion } from '../../context/InversionContext';
//import { useSettings } from '../../context/SettingsContext';
import BackArrow from '../common/BackArrow/BackArrow';
import ControlsSection from './components/ControlsSection';
import ProgressSection from './components/ProgressSection';
import DisplaySection from './components/DisplaySection';
import { useAudio } from '../../context/AudioContext'; // Añadir esta importación
import { useIsMobile } from '../../hooks/useIsMobile';

const Settings = () => {
  const navigate = useNavigate();
  const { isInverted } = useInversion();
  const { volume, changeVolume } = useAudio(); // Cambiar de useSettings a useAudio
  const isMobile = useIsMobile(); // Hook para detectar dispositivos móviles


  const handleBack = () => {
    navigate('/levels');
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume); // Ahora usar changeVolume del contexto de audio
  };

  return (
    <SettingsContainer $isInverted={isInverted}>
      <BackArrow onClick={handleBack} />
      <SettingsContent>
        <Title $isInverted={isInverted}>Configuración</Title>
        
        {/* Sección de pantalla */}
        <DisplaySection isInverted={isInverted} />
        
        {/* Sección de sonido */}
        <Section>
          <SectionTitle $isInverted={isInverted} id="sonido">Sonido</SectionTitle>          
            <VolumeSlider 
              id="sonido"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              $isInverted={isInverted}
              aria-labelledby="sonido"
              aria-valuemin="0"
              aria-valuemax="1"
              aria-valuenow={volume}
              tabIndex="0"
            />
        </Section>
        
        {/* Sección de controles - Solo mostrar en escritorio */}
        {!isMobile && (
          <Section>
            <SectionTitle $isInverted={isInverted}>Controles</SectionTitle>
            <ControlsSection />
          </Section>
        )}
        
        {/* Sección de progreso */}
        <ProgressSection isInverted={isInverted} />
      </SettingsContent>
    </SettingsContainer>
  );
};

export default Settings;