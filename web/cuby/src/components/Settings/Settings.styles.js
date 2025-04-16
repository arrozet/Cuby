import styled, { keyframes } from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const SettingsContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  position: relative;
`;

export const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;
  border-radius: 20px;
  background-color: transparent;
  max-width: 1200px; /* Aumentado de 800px para aprovechar más espacio */
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  
  /* Ocultar la barra de desplazamiento pero mantener la funcionalidad */
  /* Para navegadores basados en WebKit (Chrome, Safari, nuevas versiones de Edge) */
  &::-webkit-scrollbar {
    width: 0.1em;
    background: transparent;
  }
  
  /* Para Firefox */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  
  /* Para Internet Explorer y Edge anterior */
  -ms-overflow-style: none;
`;

export const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 40px;
  color: ${props => getActiveColor(props.$isInverted)};
`;

// Sección de sonido
export const Section = styled.div`
  width: 100%;
  margin-bottom: 40px; /* Aumentado el espacio entre secciones */
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  margin-bottom: 20px;
  color: ${props => getActiveColor(props.$isInverted)};
`;

export const VolumeSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 12px; /* Aumentado para mejor visibilidad */
  border-radius: 8px;
  background: ${props => getActiveColor(props.$isInverted)};
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: white;
    cursor: pointer;
  }
`;

// Sección de controles
export const ControlsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px; /* Aumentado el espacio entre filas */
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: center; /* Centrado en lugar de space-around */
  flex-wrap: wrap;
  gap: 40px; /* Mayor espacio entre controles */
  margin-bottom: 20px;
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 20px; /* Aumentado el margen horizontal */
  min-width: 120px; /* Ancho mínimo para evitar controles muy estrechos */
`;

export const ControlLabel = styled.div`
  font-size: 24px;
  margin-bottom: 10px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
`;

// Animación para el parpadeo
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
`;

export const KeyButton = styled.div`
  width: 100px; /* Aumentado de 80px */
  height: 100px; /* Aumentado de 80px */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.$isLong ? '18px' : '24px'};
  border: 3px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 10px;
  color: ${props => getActiveColor(props.$isInverted)};
  background-color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  user-select: none;
  cursor: pointer;
  padding: 10px;
  text-align: center;
  word-break: break-word;
  animation: ${props => props.$isChanging ? blink : 'none'} 1s ease-in-out infinite;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const LongKeyButton = styled(KeyButton)`
  width: 320px; /* Ligeramente más ancho */
  font-size: 22px;
`;

// Botón para la barra espaciadora
export const SpacebarButton = styled(KeyButton)`
  width: 320px;
  font-size: 22px;
`;

// Grupo de controles de salto (W + Barra espaciadora)
export const JumpControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 15px;
  padding: 15px;
  background-color: transparent;
  gap: 15px;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => getActiveColor(props.$isInverted)};
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Mensaje de error para teclas duplicadas
export const ErrorMessage = styled.div`
  background-color: ${props => props.$isInverted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.$success 
    ? (props.$isInverted ? '#66bb6a' : '#4caf50')  // Verde para mensajes de éxito
    : (props.$isInverted ? '#ff6666' : '#ff3333')  // Rojo para mensajes de error
  };
  border: 2px solid ${props => props.$success 
    ? (props.$isInverted ? '#66bb6a' : '#4caf50')  // Verde para mensajes de éxito
    : (props.$isInverted ? '#ff6666' : '#ff3333')  // Rojo para mensajes de error
  };
  border-radius: 8px;
  padding: 12px 20px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  animation: ${keyframes`
    0% { opacity: 0; transform: translateY(-10px); }
    100% { opacity: 1; transform: translateY(0); }
  `} 0.3s ease-out;
`;

// Botón para resetear progreso
export const ResetButton = styled.button`
  background-color: ${props => props.$isInverted ? '#ff6666' : '#ff3333'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 18px;
  font-family: 'Excalifont';
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$isInverted ? '#ff3333' : '#e53935'};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;