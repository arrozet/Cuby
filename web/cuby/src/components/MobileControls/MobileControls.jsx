import React from 'react';
import { FaArrowLeft, FaArrowRight, FaArrowUp, FaPalette } from 'react-icons/fa';
import {
  MobileControlsContainer,
  MovementControls,
  ActionControls,
  LeftButton,
  RightButton,
  JumpButton,
  ColorButton
} from './MobileControls.styles';

const MobileControls = ({ 
  onLeftPress, 
  onRightPress, 
  onJumpPress, 
  onColorPress,
  onTouchEnd,
  isInverted 
}) => {
  // Función para manejar el inicio de los eventos táctiles
  const handleTouchStart = (handler) => (e) => {
    e.stopPropagation();
    handler();
  };

  // Función para manejar el fin de los eventos táctiles
  const handleTouchEnd = (e) => {
    e.stopPropagation();
    onTouchEnd();
  };

  return (
    <MobileControlsContainer>
      <MovementControls>
        <LeftButton 
          onTouchStart={handleTouchStart(onLeftPress)}
          onTouchEnd={handleTouchEnd}
          $isInverted={isInverted}
        >
          <FaArrowLeft />
        </LeftButton>
        <RightButton 
          onTouchStart={handleTouchStart(onRightPress)}
          onTouchEnd={handleTouchEnd}
          $isInverted={isInverted}
        >
          <FaArrowRight />
        </RightButton>
      </MovementControls>
      
      <ActionControls>
        <JumpButton 
          onTouchStart={handleTouchStart(onJumpPress)}
          onTouchEnd={handleTouchEnd}
          $isInverted={isInverted}
        >
          <FaArrowUp />
        </JumpButton>
        <ColorButton 
          onTouchStart={handleTouchStart(onColorPress)}
          onTouchEnd={handleTouchEnd}
          $isInverted={isInverted}
        >
          <FaPalette />
        </ColorButton>
      </ActionControls>
    </MobileControlsContainer>
  );
};

export default MobileControls; 