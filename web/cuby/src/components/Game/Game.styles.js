import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors'; // Import color utils

// New Wrapper for centering the scaled game
export const GameWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => getInactiveColor(props.$isInverted)}; /* Use dynamic background */
  transition: background-color 0.3s ease;
  overflow: hidden; /* Prevent scrollbars on the body */
`;

export const GameContainer = styled.div`
  position: relative;
  /* Base dimensions - these will be scaled via transform */
  width: ${props => props.$baseWidth}px;
  height: ${props => props.$baseHeight}px;
  border: 2px solid ${props => getActiveColor(props.$isInverted)}; /* Use dynamic border color */
  overflow: hidden;
  transform-origin: top left; /* Scale from the top-left corner */
  background-color: ${props => getInactiveColor(props.$isInverted)}; /* Match wrapper or specific game bg */
  transition: border-color 0.3s ease, background-color 0.3s ease;
  /* Scale and position will be applied via inline style in the component */
`;

export const WinMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Use clamp for responsive font size */
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-family: 'Excalifont', sans-serif; /* Ensure correct font */
  padding: clamp(15px, 3vw, 25px);
  background-color: ${props => getInactiveColor(props.$isInverted)}e6; /* Use dynamic bg with opacity */
  border: 3px solid ${props => getActiveColor(props.$isInverted)}; /* Use dynamic border */
  color: ${props => getActiveColor(props.$isInverted)}; /* Use dynamic text color */
  border-radius: 10px;
  z-index: 100;
  text-align: center;
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;

  h2 {
    margin-bottom: 15px;
    font-size: inherit; /* Inherit clamped size */
  }

  button {
    margin: 10px 5px 0;
    padding: clamp(8px, 1.5vw, 12px) clamp(12px, 2.5vw, 20px);
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    /* Add dynamic button styling */
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
    border: 1px solid ${props => getActiveColor(props.$isInverted)};
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Excalifont';
    transition: all 0.2s ease;

    &:hover {
       opacity: 0.85;
    }
  }
`;