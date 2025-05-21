import React, { useState } from 'react';
import { Section, SectionTitle, ResetButton, ErrorMessage } from '../Settings.styles';
import { useSettings } from '../../../context/SettingsContext';

/**
 * Component that renders the game progress section
 * @param {Object} props Component props
 * @param {boolean} props.isInverted Whether the color scheme is inverted
 * @returns {JSX.Element} Progress section component
 */
const ProgressSection = ({ isInverted }) => {
  const { completedLevels, resetCompletedLevels } = useSettings();
  const [resetMessage, setResetMessage] = useState('');

  const handleResetProgress = () => {
    resetCompletedLevels();
    setResetMessage('Progreso de niveles reseteado. Ahora solo el nivel 1 está desbloqueado.');
    setTimeout(() => {
      setResetMessage('');
    }, 3000);
  };

  return (
    <Section>
      <SectionTitle $isInverted={isInverted}>Progreso del Juego</SectionTitle>
      
      <div style={{ marginBottom: '15px', color: isInverted ? 'black' : 'white' }}>
        Niveles completados: {completedLevels.length === 1
          ? 'Nivel 1' 
          : completedLevels.filter(id => id !== 1).map(id => `Nivel ${id}`).join(', ')
        }
      </div>
      
      <ResetButton 
        onClick={handleResetProgress}
        $isInverted={isInverted}
      >
        Resetear progreso de niveles
      </ResetButton>
      
      {resetMessage && (
        <ErrorMessage $isInverted={isInverted} $success>
          {resetMessage}
        </ErrorMessage>
      )}
    </Section>
  );
};

export default ProgressSection; 