import React from 'react';
import { KeyButton, SpacebarButton } from '../Settings.styles';

/**
 * Reusable component for control buttons
 * @param {Object} props Component props
 * @param {string} props.controlKey The key identifier for the control
 * @param {boolean} props.isInverted Whether the color scheme is inverted
 * @param {string} props.changingControl The currently changing control
 * @param {Function} props.onClick Click handler for the button
 * @param {string} props.display The text to display on the button
 * @returns {JSX.Element} Control button component
 */
const ControlButton = ({ controlKey, isInverted, changingControl, onClick, display }) => {
  const isSpacebar =
    controlKey === 'jumpAlt' ||
    display === ' ' ||
    display.toLowerCase().includes('espaciadora') ||
    display.toLowerCase() === 'space';

  const ButtonComponent = isSpacebar ? SpacebarButton : KeyButton;
  
  return (
    <ButtonComponent
      $isInverted={isInverted}
      $isChanging={changingControl === controlKey}
      onClick={() => onClick?.(controlKey)}
    >
      {display}
    </ButtonComponent>
  );
};

export default ControlButton; 