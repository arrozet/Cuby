import React from 'react';
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

  if (!keyMapping) return null;

  return (
    <StyledControlsSection>
      {errorMessage && (
        <ErrorMessage $isInverted={isInverted}>
          {errorMessage}
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
          <ControlLabel $isInverted={isInverted}>Agacharse</ControlLabel>
          <ControlButton
            controlKey="crouch"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.crouch.display}
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

        <ControlGroup>
          <ControlLabel $isInverted={isInverted}>Interactuar</ControlLabel>
          <ControlButton
            controlKey="interact"
            isInverted={isInverted}
            changingControl={changingControl}
            onClick={handleKeyClick}
            display={keyMapping.interact.display}
          />
        </ControlGroup>
      </ControlsRow>

      <ResetControlsButton
        onClick={resetKeyMapping}
        $isInverted={isInverted}
      >
        Restablecer controles predeterminados
      </ResetControlsButton>

      {changingControl && !errorMessage && (
        <div style={{ textAlign: 'center', marginTop: '20px', color: isInverted ? 'black' : 'white' }}>
          Presiona una tecla para asignarla a "{controlDescriptions[changingControl]}" o ESC para cancelar
        </div>
      )}
    </StyledControlsSection>
  );
};

export default ControlsSection; 