import styled from 'styled-components';

export const ControlsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 14px;
  z-index: 100;
  user-select: none;    // Evitar que el texto sea seleccionable
  pointer-events: none; // Evitar que interfiera con los controles del juego
`;