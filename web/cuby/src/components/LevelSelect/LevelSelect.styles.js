import styled, { keyframes, css } from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const LevelSelectContainer = styled.div`
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
  padding: 20px; /* Add base padding */
  padding-top: 80px; /* Extra padding top for buttons */
  overflow-y: auto; /* Allow scroll if content overflows */
`;

// Title removed as it wasn't in the original LevelSelect.jsx, add if needed

export const LevelsGrid = styled.div`
  display: grid;
  /* Flexible columns: fit as many 120px-1fr cards as possible */
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: clamp(15px, 4vw, 30px); /* Responsive gap */
  justify-content: center;
  width: 100%;
  max-width: 800px; /* Adjust max width */
  margin-top: 20px; /* Add margin below buttons */
`;

export const LevelCard = styled.div`
  aspect-ratio: 1 / 1; /* Maintain square shape */
  border: 3px solid ${props => props.locked ? '#555' : getActiveColor(props.$isInverted)};
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s, background-color 0.3s, border-color 0.3s;
  background-color: ${props => props.locked ? 'rgba(50, 50, 50, 0.7)' : getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  filter: ${props => props.locked ? 'grayscale(50%)' : 'none'};
  opacity: ${props => props.locked ? 0.7 : 1}; /* Slightly more faded when locked */

  &:hover {
    animation: ${props => !props.locked && css`${pulse} 1.5s infinite ease-in-out`};
    transform: ${props => !props.locked ? 'scale(1.05)' : 'none'};
  }

  .level-number {
    /* Responsive font size */
    font-size: clamp(2.5rem, 10vw, 4rem);
    font-weight: normal;
    opacity: ${props => props.locked ? 0.5 : 1};
  }

  .lock-icon {
    position: absolute;
    top: clamp(5px, 1.5vw, 10px); /* Responsive position */
    right: clamp(5px, 1.5vw, 10px); /* Responsive position */
    font-size: clamp(1.2rem, 4vw, 1.75rem); /* Responsive size */
    color: #ff9800;
    text-shadow: 0 0 5px rgba(0,0,0,0.5);
  }
`;

// Common style for top buttons
const TopButton = styled.button`
  position: absolute;
  top: clamp(15px, 3vh, 25px); /* Responsive top */
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  border: none;
  border-radius: 10px;
  padding: clamp(8px, 1.5vh, 12px) clamp(15px, 4vw, 25px); /* Responsive padding */
  font-size: clamp(0.9rem, 2.5vw, 1.1rem); /* Responsive font size */
  font-family: 'Excalifont';
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s, color 0.3s;
  z-index: 10;

  &:hover {
    transform: scale(1.05);
    /* Re-apply colors on hover to prevent unexpected changes */
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }
`;


export const UserLevelsButton = styled(TopButton)`
  /* Center the button */
  left: 50%;
  transform: translateX(-50%);

  &:hover {
    /* Keep centering transform on hover */
    transform: translateX(-50%) scale(1.05);
  }
`;

// Apply similar responsive styles to BackArrow and SettingsButton containers
// (Assuming they are used in LevelSelect.jsx)

// Example: If BackArrow uses BackArrowContainer from its own styles:
// Ensure BackArrow.styles.js uses clamp for size/position
// Example: If SettingsButton uses SettingsButtonContainer:
// Ensure SettingsButton.styles.js uses clamp for size/position