// --- START OF FILE LevelEditor.styles.js ---

import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

// ... (EditorContainer remains the same) ...
export const EditorContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => getInactiveColor(props.isInverted)};
  font-family: 'Excalifont';
  position: relative;
  overflow: hidden;
`;

// ... (EditorToolbar remains the same) ...
export const EditorToolbar = styled.div`
  width: 100%;
  display: flex;
  padding: 25px 15px 15px 15px; /* Aumentado el padding superior */
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative;
`;


export const ToolbarItem = styled.button`
  background-color: ${props => props.isActive
    ? (props.isInverted ? 'black' : 'white') // Active: Black bg (dark), White bg (light)
    : 'transparent'};                       // Inactive: Transparent bg
  color: ${props => props.isActive
    ? (props.isInverted ? 'white' : 'black') // Active: White text (dark), Black text (light)
    : getActiveColor(props.isInverted)};   // Inactive: Active color text (White on dark, Black on light)
  border: 1px solid ${props => getActiveColor(props.isInverted)}; // Border is always active color
  border-radius: 5px;
  padding: 8px 15px;
  margin-right: 10px;
  cursor: pointer;
  font-family: 'Excalifont';
  font-size: 14px;
  transition: all 0.2s;

  &:hover:not(:disabled) { // Added :not(:disabled) for robustness
    ${props => !props.isActive && `
      // --- Inactive Button Hover ---
      // Dark Mode (isInverted): White bg, Black text
      // Light Mode (!isInverted): Black bg, White text
      background-color: ${props.isInverted ? 'white' : 'black'};
      color: ${props.isInverted ? 'black' : 'white'};
      // Optional: change border color too for better contrast on hover
      // border-color: ${props.isInverted ? 'black' : 'white'};
    `}

    ${props => props.isActive && `
      // --- Active Button Hover (Subtle effect) ---
      opacity: 0.85; // Example: Slightly reduce opacity
      // Or slightly change background:
      // background-color: ${props.isInverted ? '#111' : '#f0f0f0'};
    `}
  }

  // Add styles for disabled state if needed, e.g., for Save button
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ... (Rest of the styles: EditorCanvas, EditorSidebar, etc., remain the same) ...

export const EditorCanvas = styled.div`
  flex: 1;
  background-color: ${props => getInactiveColor(props.isInverted)};
  position: relative;
  overflow: auto;
  cursor: crosshair;
`;

export const EditorSidebar = styled.div`
  width: 250px;
  height: 100%;
  background-color: ${props => getInactiveColor(props.isInverted)}dd;
  border-left: 1px solid ${props => getActiveColor(props.isInverted)}30;
  padding: 20px;
  overflow-y: auto;
`;

export const SidebarTitle = styled.h2`
  color: ${props => getActiveColor(props.isInverted)};
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
`;

export const ElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ElementButton = styled.button`
  background-color: ${props => props.isSelected
    ? getActiveColor(props.isInverted)
    : 'transparent'};
  color: ${props => props.isSelected
    ? getInactiveColor(props.isInverted)
    : getActiveColor(props.isInverted)};
  border: 2px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 5px;
  padding: 10px;
  text-align: left;
  font-family: 'Excalifont';
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    /* Keep or adjust the hover for element buttons if needed */
    background-color: ${props => getActiveColor(props.isInverted)}20;
  }
`;

export const SaveDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const SaveDialogContent = styled.div`
  background-color: ${props => getInactiveColor(props.isInverted)};
  border: 2px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 10px;
  padding: 30px;
  width: 400px;
  max-width: 90%;

  h2 {
    color: ${props => getActiveColor(props.isInverted)};
    margin-bottom: 20px;
    text-align: center;
  }

  p {
    color: ${props => getActiveColor(props.isInverted)};
    margin-bottom: 15px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  background-color: ${props => getInactiveColor(props.isInverted)};
  color: ${props => getActiveColor(props.isInverted)};
  border: 1px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 5px;
  margin-bottom: 20px;
  font-family: 'Excalifont';
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${props => getActiveColor(props.isInverted)};
    box-shadow: 0 0 0 2px ${props => getActiveColor(props.isInverted)}40;
  }

  &::placeholder {
    color: ${props => getActiveColor(props.isInverted)}80;
  }
`;

// Modified SaveDialogButtons to use theme colors better
export const SaveDialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Excalifont';
    transition: all 0.2s;
    border: 1px solid ${props => getActiveColor(props.isInverted)};
    background-color: transparent;
    color: ${props => getActiveColor(props.isInverted)};

    &:hover:not(:disabled) {
      background-color: ${props => getActiveColor(props.isInverted)};
      color: ${props => getInactiveColor(props.isInverted)};
    }

    // Style for the primary action button (Save)
    &:last-child:not(:disabled) {
      background-color: ${props => getActiveColor(props.isInverted)};
      color: ${props => getInactiveColor(props.isInverted)};
      border-color: ${props => getActiveColor(props.isInverted)};

      &:hover {
        opacity: 0.85; // Slight hover effect for primary button
      }
    }

    &:disabled {
      background-color: #cccccc !important; // Use !important sparingly, or better define disabled state based on theme
      color: #666666 !important;
      border-color: #cccccc !important;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

// --- END OF FILE LevelEditor.styles.js ---