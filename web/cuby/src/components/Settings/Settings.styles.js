import styled, { keyframes } from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const SettingsContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex; /* Keep flex for alignment */
  flex-direction: column;
  align-items: center; /* Center content horizontally */
  background-color: ${props => getInactiveColor(props.$isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  position: relative;
  padding: clamp(60px, 10vh, 80px) 15px 30px 15px; /* Responsive padding (top includes space for BackArrow) */
  overflow-y: auto; /* Allow vertical scrolling */
`;

export const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; /* Use full width */
  max-width: 900px; /* Limit max width */
  padding: 0 clamp(10px, 3vw, 20px); /* Horizontal padding */
  /* Remove fixed height/max-height */
`;

export const Title = styled.h1`
  font-size: clamp(2rem, 7vw, 3rem); /* Responsive */
  margin-bottom: clamp(25px, 6vh, 40px); /* Responsive */
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
`;

// Sección de sonido
export const Section = styled.div`
  width: 100%;
  margin-bottom: clamp(30px, 6vh, 45px); /* Responsive */
`;

export const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 5vw, 2rem); /* Responsive */
  margin-bottom: clamp(15px, 3vh, 20px); /* Responsive */
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center; /* Center section titles */
`;

export const VolumeSlider = styled.input`
  /* ... (keep existing slider styles, they are mostly relative) ... */
  width: 100%;
  max-width: 400px; /* Limit width on large screens */
  margin: 0 auto; /* Center the slider */
  display: block; /* Needed for margin auto */
  height: 12px;
  border-radius: 8px;
  background: ${props => getActiveColor(props.$isInverted)};
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
   -webkit-appearance: none;
   appearance: none;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: ${props => getInactiveColor(props.$isInverted)};
    border: 1px solid ${props => getActiveColor(props.$isInverted)};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: ${props => getInactiveColor(props.$isInverted)};
    border: 1px solid ${props => getActiveColor(props.$isInverted)};
    cursor: pointer;
  }
`;

// Sección de controles
export const ControlsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center rows */
  gap: clamp(20px, 4vh, 30px); /* Responsive gap */
`;

export const ControlsRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap; /* Allow controls to wrap */
  gap: clamp(15px, 3vw, 30px); /* Responsive gap */
  width: 100%;
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 90px; /* Adjust min-width */
`;

export const ControlLabel = styled.div`
  font-size: clamp(1rem, 3vw, 1.3rem); /* Responsive */
  margin-bottom: 8px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
  white-space: nowrap; /* Prevent label wrapping */
`;

// Animación para el parpadeo
const blink = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
`;

export const KeyButton = styled.div`
  width: clamp(60px, 15vw, 85px); /* Responsive size */
  height: clamp(60px, 15vw, 85px); /* Responsive size */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1rem, 4vw, 1.5rem); /* Responsive font */
  border: 3px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 10px;
  color: ${props => getActiveColor(props.$isInverted)};
  background-color: ${props => props.$isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  user-select: none;
  cursor: pointer;
  padding: 5px;
  text-align: center;
  word-break: break-word;
  transition: background-color 0.2s, border-color 0.3s, color 0.3s;
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
  width: clamp(180px, 50vw, 280px); /* Responsive width */
  font-size: clamp(0.9rem, 3.5vw, 1.3rem); /* Adjust font size */
`;

// Grupo de controles de salto (W + Barra espaciadora)
export const JumpControlGroup = styled.div`
  display: flex;
  flex-direction: column; /* Stack vertically by default */
  align-items: center;
  border: 2px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 15px;
  padding: clamp(10px, 2vh, 15px);
  gap: clamp(10px, 2vh, 15px);

  /* Arrange side-by-side on larger screens if desired */
   @media (min-width: 400px) {
     flex-direction: row;
     /* Adjust alignment if needed */
   }
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
  padding: clamp(8px, 1.5vh, 12px) clamp(15px, 3vw, 20px); /* Responsive */
  margin: 15px auto; /* Center horizontally */
  width: fit-content; /* Size to content */
  max-width: 90%; /* Prevent overflow */
  text-align: center;
  font-size: clamp(0.9rem, 2.5vw, 1.1rem); /* Responsive */
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
  padding: clamp(10px, 1.8vh, 12px) clamp(15px, 4vw, 20px); /* Responsive */
  font-size: clamp(1rem, 3vw, 1.1rem); /* Responsive */
  font-family: 'Excalifont';
  cursor: pointer;
  transition: all 0.2s;
  display: block; /* Allow margin auto */
  margin: 15px auto 0 auto; /* Center horizontally */

  &:hover {
    background-color: ${props => props.$isInverted ? '#ff3333' : '#e53935'};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Info text styling
export const InfoText = styled.div`
   margin-bottom: 15px;
   color: ${props => getActiveColor(props.$isInverted)};
   font-size: clamp(0.9rem, 2.5vw, 1.1rem); /* Responsive */
   text-align: center;
`;

export const ChangeKeyPrompt = styled(InfoText)`
   margin-top: 20px;
   font-weight: bold;
`;