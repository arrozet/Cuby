import React, { useRef, useEffect } from 'react';
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
  // Referencias para los intervalos
  const leftIntervalRef = useRef(null);
  const rightIntervalRef = useRef(null);
  
  // Referencias para rastrear el estado de los botones
  const leftPressedRef = useRef(false);
  const rightPressedRef = useRef(false);

  // Limpiar intervalos al desmontar el componente
  useEffect(() => {
    return () => {
      if (leftIntervalRef.current) {
        clearInterval(leftIntervalRef.current);
      }
      if (rightIntervalRef.current) {
        clearInterval(rightIntervalRef.current);
      }
    };
  }, []);

  // Función para manejar el inicio del movimiento hacia la izquierda
  const handleLeftStart = (e) => {
    e.stopPropagation();
    if (leftPressedRef.current) return; // Evitar múltiples intervalos
    
    leftPressedRef.current = true;
    onLeftPress(); // Llamada inicial inmediata
    
    // Configurar intervalo para enviar eventos continuos
    leftIntervalRef.current = setInterval(() => {
      if (leftPressedRef.current) {
        onLeftPress();
      }
    }, 16); // ~60fps para mantener el movimiento fluido
  };

  // Función para manejar el fin del movimiento hacia la izquierda
  const handleLeftEnd = (e) => {
    e.stopPropagation();
    leftPressedRef.current = false;
    
    if (leftIntervalRef.current) {
      clearInterval(leftIntervalRef.current);
      leftIntervalRef.current = null;
    }
    
    onLeftTouchEnd();
  };

  // Función para manejar el inicio del movimiento hacia la derecha
  const handleRightStart = (e) => {
    e.stopPropagation();
    if (rightPressedRef.current) return; // Evitar múltiples intervalos
    
    rightPressedRef.current = true;
    onRightPress(); // Llamada inicial inmediata
    
    // Configurar intervalo para enviar eventos continuos
    rightIntervalRef.current = setInterval(() => {
      if (rightPressedRef.current) {
        onRightPress();
      }
    }, 16); // ~60fps para mantener el movimiento fluido
  };

  // Función para manejar el fin del movimiento hacia la derecha
  const handleRightEnd = (e) => {
    e.stopPropagation();
    rightPressedRef.current = false;
    
    if (rightIntervalRef.current) {
      clearInterval(rightIntervalRef.current);
      rightIntervalRef.current = null;
    }
    
    onRightTouchEnd();
  };

  // Función para manejar el salto (sin intervalo, es un evento único)
  const handleJumpStart = (e) => {
    e.stopPropagation();
    onJumpPress();
  };

  // Función para manejar el cambio de color (sin intervalo, es un evento único)
  const handleColorStart = (e) => {
    e.stopPropagation();
    onColorPress();
  };

  return (
    <>
      {/* Botón de colores encima del botón de saltar */}
      <ColorButton 
        onTouchStart={handleColorStart}
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
            onTouchStart={handleLeftStart}
            onTouchEnd={handleLeftEnd}
            onTouchCancel={handleLeftEnd} // Importante para cuando se cancela el toque
            $isInverted={isInverted}
            aria-label="Mover a la izquierda"
          >
            <FaArrowLeft />
          </LeftButton>
          <RightButton 
            onTouchStart={handleRightStart}
            onTouchEnd={handleRightEnd}
            onTouchCancel={handleRightEnd} // Importante para cuando se cancela el toque
            $isInverted={isInverted}
            aria-label="Mover a la derecha"
          >
            <FaArrowRight />
          </RightButton>
        </MovementControls>
        
        <ActionControls>
          <JumpButton 
            onTouchStart={handleJumpStart}
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