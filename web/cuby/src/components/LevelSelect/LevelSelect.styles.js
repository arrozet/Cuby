import styled, { keyframes, css } from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const hoverShake = keyframes`
  0%, 100% { transform: translateX(0) scale(1.05); }
  25% { transform: translateX(-2px) scale(1.05); }
  75% { transform: translateX(2px) scale(1.05); }
`;

export const LevelSelectContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  /* Removed justify-content: center; to allow top alignment */
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
  /* Flexible columns: fit as many cards as possible */
  /* On smaller screens, make min size smaller */
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); /* Reduced min size */
  gap: clamp(8px, 2vw, 15px); /* Reduced gap */
  justify-content: center;
  width: 100%;
  max-width: 500px; /* Slightly reduced max width */
  margin-top: 20px; /* Add margin below buttons */
  padding-bottom: 20px; /* Add padding at the bottom */

  /* Larger minimum size for wider screens */
  @media (min-width: 600px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); /* Reduced min size */
    gap: clamp(10px, 3vw, 20px); /* Reduced gap */
  }
`;

export const LevelCard = styled.div`
  aspect-ratio: 1 / 1; /* Maintain square shape */
  border: 3px solid ${props => props.$locked ? '#555' : getActiveColor(props.$isInverted)};
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s, background-color 0.3s, border-color 0.3s;
  background-color: ${props => props.$locked ? 'rgba(50, 50, 50, 0.7)' : getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  cursor: ${props => props.$locked ? 'not-allowed' : 'pointer'};
  filter: ${props => props.$locked ? 'grayscale(50%)' : 'none'};
  opacity: ${props => props.$locked ? 0.7 : 1}; /* Slightly more faded when locked */
  ${props =>
    !props.$locked &&
    props.$isLastAvailable &&
    css`
      animation: ${pulse} 1.5s infinite ease-in-out;
    `}

  &:hover {
    transform: ${props => (!props.$locked ? 'scale(1.05)' : 'none')}; // Mantenemos el scale inicial del hover
    /* Apply new hover animation only if it's not locked and not the last available card */
    ${props =>
      !props.$locked &&
      !props.$isLastAvailable &&
      css`
        animation: ${hoverShake} 0.5s ease-in-out; // Aplicamos la nueva animación
      `}
  }

  .level-number {
    /* Responsive font size - reduced max size */
    font-size: clamp(1.5rem, 6vw, 2.5rem); /* Reduced font size */
    font-weight: normal;
    opacity: ${props => props.$locked ? 0.5 : 1};
  }

  .lock-icon {
    position: absolute;
    top: clamp(5px, 1.5vw, 10px); /* Responsive position */
    right: clamp(5px, 1.5vw, 10px); /* Responsive position */
    font-size: clamp(1rem, 3vw, 1.5rem); /* Adjust size as needed for the FontAwesome icon */
    color: ${props => getActiveColor(props.$isInverted)}; /* This will set the icon color */
    /* Ensure the icon is vertically centered if its height differs from line-height */
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TopButton = styled.button`
  position: absolute;
  top: clamp(15px, 3vh, 25px);
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  border: none;
  padding: clamp(8px, 1.5vh, 12px) clamp(15px, 4vw, 25px);
  font-size: clamp(0.9rem, 2.5vw, 1.1rem);
  font-family: 'Excalifont';
  cursor: pointer;
  transition: transform 0.2s, background-color 0.3s, color 0.3s;
  z-index: 10;
  box-sizing: border-box;

  &:hover {
    transform: scale(1.05);
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }
`;

export const UserLevelsButton = styled(TopButton)`
  position: absolute;
  right: 100px;
  clip-path: polygon(0% 30%, 15% 20%, 20% 0%, 30% 20%, 45% 10%, 55% 25%, 70% 5%, 80% 25%, 85% 0%, 100% 20%, 95% 50%, 100% 80%, 85% 75%, 80% 100%, 65% 85%, 50% 95%, 35% 85%, 20% 100%, 15% 75%, 0% 70%, 5% 50%);
  padding: clamp(15px, 2.2vh, 20px) clamp(30px, 5.5vw, 45px);

  &:hover {
    transform: scale(1.05);
    animation-play-state: paused;
  }

  @media (max-width: 600px) {
    right: 90px;
    padding: clamp(12px, 2vh, 18px) clamp(25px, 5vw, 40px);
  }
`;