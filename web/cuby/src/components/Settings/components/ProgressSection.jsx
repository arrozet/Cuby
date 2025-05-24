import React, { useState } from 'react';
import { Section, SectionTitle, ResetButton, ErrorMessage } from '../Settings.styles';
import { useSettings } from '../../../context/SettingsContext';
import { SaveDialog, SaveDialogContent, SaveDialogButtons } from '../../LevelEditor/dialogs/dialogs.styles';

/**
 * Component that renders the game progress section
 * @param {Object} props Component props
 * @param {boolean} props.isInverted Whether the color scheme is inverted
 * @returns {JSX.Element} Progress section component
 */
const ProgressSection = ({ isInverted }) => {
  const { completedLevels, resetCompletedLevels } = useSettings();
  const [resetMessage, setResetMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetProgress = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    resetCompletedLevels();
    setResetMessage('Progreso de niveles reseteado. Ahora solo el nivel 1 está desbloqueado.');
    setShowConfirm(false);
    setTimeout(() => {
      setResetMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // Determinar el nivel actual (el más alto completado, o 1 si no hay ninguno)
  const nivelActual = completedLevels.length > 0
    ? `Nivel ${Math.max(...completedLevels)}`
    : 'Nivel 1';

  return (
    <Section>
      <SectionTitle $isInverted={isInverted}>Progreso del Juego</SectionTitle>
      
      <div style={{ marginBottom: '15px', color: isInverted ? 'black' : 'white' }}>
        Nivel Actual: {nivelActual}
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

      {showConfirm && (
        <SaveDialog>
          <SaveDialogContent $isInverted={isInverted}>
            <h2>¿Restablecer progreso?</h2>
            <p>¿Está seguro de que desea restablecer todo el progreso?<br/>Esta acción es irreversible.</p>
            <SaveDialogButtons $isInverted={isInverted}>
              <button onClick={handleConfirm}>Restablecer</button>
              <button onClick={handleCancel}>Cancelar</button>
            </SaveDialogButtons>
          </SaveDialogContent>
        </SaveDialog>
      )}
    </Section>
  );
};

export default ProgressSection; 