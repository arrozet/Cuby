import React, { useEffect, useState } from 'react';
import {
  ControlsSection as StyledControlsSection,
  ControlsRow,
  ControlGroup,
  ControlLabel,
  JumpControlGroup,
  ErrorMessage,
  ResetControlsButton
} from '../Settings.styles';
import { useControls } from '../hooks/useControls';
import ControlButton from './ControlButton';
import { controlDescriptions } from '../constants/controls';

/**
 * Component that renders the game controls section
 * @returns {JSX.Element} Controls section component
 */
const ControlsSection = () => {
  const {
    isInverted,
    keyMapping,
    changingControl,
    errorMessage,
    handleKeyClick,
    resetKeyMapping
  } = useControls();

  // Estado local para ocultar el mensaje de error tras unos segundos
  const [localError, setLocalError] = useState(errorMessage);

  useEffect(() => {
    setLocalError(errorMessage);
    if (errorMessage) {
      const timer = setTimeout(() => setLocalError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Mostrar el mensaje de ayuda arriba, como el de error
  const showHelp = changingControl && !localError;

  if (!keyMapping) return null;

  return (
    <StyledControlsSection>
      {localError && (
        <ErrorMessage $isInverted={isInverted}>
          {localError}
        </ErrorMessage>
      )}
      {showHelp && (
        <ErrorMessage $isInverted={isInverted} $success>
          Presiona una tecla para asignarla a "{controlDescriptions[changingControl]}" o ESC para cancelar
        </ErrorMessage>
      )}
      <ControlsRow>
        <JumpControlGroup $isInverted={isInverted}>
          <ControlLabel $isInverted={isInverted}>Saltar</ControlLabel>
          <ControlButton
            controlKey="jump"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.jump.display}
          />
          <ControlButton
            controlKey="jumpAlt"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.jumpAlt.display}
          />
        </JumpControlGroup>

        <ControlGroup>
          <ControlLabel $isInverted={isInverted}>Invertir colores</ControlLabel>
          <ControlButton
            controlKey="invertColors"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.invertColors.display}
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel $isInverted={isInverted}>Reiniciar</ControlLabel>
          <ControlButton
            controlKey="restart"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.restart.display}
          />
        </ControlGroup>
      </ControlsRow>

      <ControlsRow>
        <ControlGroup>
          <ControlLabel $isInverted={isInverted}>Izquierda</ControlLabel>
          <ControlButton
            controlKey="left"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.left.display}
          />
        </ControlGroup>

        <ControlGroup>
          <ControlLabel $isInverted={isInverted}>Derecha</ControlLabel>
          <ControlButton
            controlKey="right"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.right.display}
          />
        </ControlGroup>
      </ControlsRow>

      <ResetControlsButton
        onClick={resetKeyMapping}
        $isInverted={isInverted}
      >
        Restablecer controles predeterminados
      </ResetControlsButton>
    </StyledControlsSection>
  );
};

export default ControlsSection; 