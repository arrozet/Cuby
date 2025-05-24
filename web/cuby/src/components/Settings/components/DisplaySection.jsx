import React from 'react';
import { Section, SectionTitle, ResetButton } from '../Settings.styles';
import { useSettings } from '../../../context/SettingsContext';

const DisplaySection = ({ isInverted }) => {
  const { isFullscreen, toggleFullscreen } = useSettings();

  return (
    <Section>
      <SectionTitle $isInverted={isInverted}>Pantalla</SectionTitle>
      <ResetButton 
        onClick={toggleFullscreen}
        $isInverted={isInverted}
      >
        {isFullscreen ? 'Salir de pantalla completa' : 'Activar pantalla completa'}
      </ResetButton>
    </Section>
  );
};

export default DisplaySection; 