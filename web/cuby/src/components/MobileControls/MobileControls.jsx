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
  onLeftTouchEnd,
  onRightTouchEnd,
  isInverted 
}) => {
  // Función para manejar el inicio de los eventos táctiles
  const handleTouchStart = (handler) => (e) => {
    e.stopPropagation();
    handler();
  };
  return (
    <>      {/* Botón de colores encima del botón de saltar */}
      <ColorButton 
        onTouchStart={handleTouchStart(onColorPress)}
        $isInverted={isInverted}
        aria-label="Invertir colores"
        style={{
          position: 'fixed',
          bottom: '170px',
          right: '30px',
          zIndex: 1001
        }}
      >
        <FaPalette />
      </ColorButton>

      <MobileControlsContainer>
        <MovementControls>
          <LeftButton 
            onTouchStart={handleTouchStart(onLeftPress)}
            onTouchEnd={onLeftTouchEnd}
            $isInverted={isInverted}
            aria-label="Mover a la izquierda"
          >
            <FaArrowLeft />
          </LeftButton>
          <RightButton 
            onTouchStart={handleTouchStart(onRightPress)}
            onTouchEnd={onRightTouchEnd}
            $isInverted={isInverted}
            aria-label="Mover a la derecha"
          >
            <FaArrowRight />
          </RightButton>
        </MovementControls>
        
        <ActionControls>
          <JumpButton 
            onTouchStart={handleTouchStart(onJumpPress)}
            $isInverted={isInverted}
            aria-label="Saltar"
          >
            <FaArrowUp />
          </JumpButton>
        </ActionControls>
      </MobileControlsContainer>
    </>
  );
};

export default MobileControls; 