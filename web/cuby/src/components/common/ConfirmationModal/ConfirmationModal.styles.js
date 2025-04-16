// src/components/common/ConfirmationModal/ConfirmationModal.styles.js
import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../../utils/colors'; // Ajusta la ruta si es necesario

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => getInactiveColor(props.$isInverted)}99; /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que esté por encima de otros elementos */
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
`;

export const ModalContainer = styled.div`
  background-color: ${props => getInactiveColor(props.$isInverted)};
  border: 3px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 15px;
  padding: 30px 40px;
  color: ${props => getActiveColor(props.$isInverted)};
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
`;

export const ModalMessage = styled.p`
  font-size: 22px;
  margin-bottom: 30px;
  line-height: 1.5;
  color: ${props => getActiveColor(props.$isInverted)};
`;

export const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center; /* Ayuda a alinear si los botones tienen diferente padding/altura inherente */
  gap: 20px; /* Añade espacio entre botones */
`;

// Estilo base para ambos botones
const ModalButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 12px 25px;
  font-size: 18px;
  font-family: 'Excalifont';
  cursor: pointer;
  /* Transiciones para color, fondo y transformación */
  transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease;

  &:hover {
    /* Solo aplicar la transformación de escala en hover */
    transform: scale(1.05);
    /* Asegurarse de que no haya cambio de opacidad */
    opacity: 1;
  }
`;

// Botón Confirmar: Fondo = color ACTIVO, Texto = color INACTIVO
export const ConfirmButton = styled(ModalButton)`
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};

  &:hover {
    /* Hereda el transform: scale(1.05) del ModalButton base */
    /* Mantenemos explícitamente los mismos colores en hover */
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }
`;

// Botón Cancelar: Fondo = color INACTIVO, Texto = color ACTIVO
export const CancelButton = styled(ModalButton)`
  background-color: ${props => getInactiveColor(props.$isInverted)};
  color: ${props => getActiveColor(props.$isInverted)};
   /* Añadimos un borde sutil para que sea visible sobre el fondo del modal que es del mismo color */
  border: 2px solid ${props => getActiveColor(props.$isInverted)}; 

  &:hover {
    /* Hereda el transform: scale(1.05) del ModalButton base */
    /* Mantenemos explícitamente los mismos colores en hover */
    background-color: ${props => getInactiveColor(props.$isInverted)};
    color: ${props => getActiveColor(props.$isInverted)};
    border-color: ${props => getActiveColor(props.$isInverted)}; /* Mantener borde en hover */
  }
`;