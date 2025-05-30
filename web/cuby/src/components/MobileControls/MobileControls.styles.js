import styled from 'styled-components';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

// Contenedor principal de los controles móviles
export const MobileControlsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
  pointer-events: auto;
  touch-action: manipulation;

  /* Mostrar en móvil y ocultar en escritorio */
  @media (min-width: 1024px) {
    display: none;
  }
`;

// Contenedor para los botones de movimiento
export const MovementControls = styled.div`
  display: flex;
  gap: 15px;
  pointer-events: auto;
  touch-action: manipulation;
  padding: 10px;
  border-radius: 15px;
`;

// Contenedor para los botones de acción
export const ActionControls = styled.div`
  display: flex;
  gap: 15px;
  pointer-events: auto;
  touch-action: manipulation;
  padding: 10px;
  border-radius: 15px;
  margin-right: 10px;
`;

// Estilo base para todos los botones
const BaseButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid ${props => getActiveColor(props.$isInverted)};
  background-color: ${props => getInactiveColor(props.$isInverted)};
  color: ${props => getActiveColor(props.$isInverted)};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.2s ease;
  touch-action: manipulation;
  padding: 0;
  margin: 0;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  pointer-events: auto;

  &:active {
    transform: scale(0.95);
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }

  /* Ajustes para pantallas más pequeñas */
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
`;

// Botones específicos
export const LeftButton = styled(BaseButton)``;
export const RightButton = styled(BaseButton)``;
export const JumpButton = styled(BaseButton)`
  width: 100px;
  height: 100px;

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;
export const ColorButton = styled(BaseButton)`
  width: 70px;
  height: 70px;
  font-size: 20px;

  @media (max-width: 480px) {
    width: 55px;
    height: 55px;
    font-size: 22px;
  }
`; 