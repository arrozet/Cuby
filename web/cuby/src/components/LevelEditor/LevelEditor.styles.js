// --- START OF FILE LevelEditor.styles.js ---

import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const EditorContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${props => getInactiveColor(props.isInverted)};
  font-family: 'Excalifont';
  position: relative;
  overflow: hidden; /* Prevent body scroll */
`;

export const EditorToolbar = styled.div`
  width: 100%;
  display: flex;
  /* Responsive padding: More top padding, flexible sides/bottom */
  padding: clamp(25px, 4vh, 35px) clamp(10px, 2vw, 15px) clamp(10px, 2vh, 15px);
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative; /* Needed for absolute positioned children like BackArrow */
  flex-wrap: wrap; /* Allow items to wrap onto the next line */
  justify-content: center; /* Center items horizontally when they wrap */
  gap: clamp(5px, 1vh, 10px); /* Gap between wrapped rows/items */
`;

export const ToolbarItem = styled.button`
  background-color: ${props => props.isActive
    ? (props.isInverted ? 'black' : 'white')
    : 'transparent'};
  color: ${props => props.isActive
    ? (props.isInverted ? 'white' : 'black')
    : getActiveColor(props.isInverted)};
  border: 1px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 5px;
  /* Responsive padding */
  padding: clamp(6px, 1.5vh, 8px) clamp(10px, 2vw, 15px);
  /* Responsive margin */
  margin: clamp(2px, 0.5vw, 5px);
  cursor: pointer;
  font-family: 'Excalifont';
  /* Responsive font size */
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  transition: all 0.2s;
  white-space: nowrap; /* Prevent text wrapping inside button */

  &:hover:not(:disabled) {
    ${props => !props.isActive && `
      background-color: ${props.isInverted ? 'white' : 'black'};
      color: ${props.isInverted ? 'black' : 'white'};
    `}
    ${props => props.isActive && `
      opacity: 0.85;
    `}
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Ensure icons/text inside scale reasonably */
  svg, img {
    width: clamp(16px, 4vw, 20px); /* Responsive icon size */
    height: auto;
    vertical-align: middle; /* Align icons better with text */
  }
`;

// Container for the main editor area (Canvas + Sidebar)
export const EditorMainArea = styled.div`
  display: flex;
  flex: 1; /* Take remaining vertical space */
  width: 100%;
  overflow: hidden; /* Prevent overflow within this area */
`;


export const EditorCanvas = styled.div`
  flex: 1; /* Take available horizontal space */
  background-color: ${props => getInactiveColor(props.isInverted)};
  position: relative; /* For positioning elements inside */
  overflow: auto; /* Allow scrolling/panning of the canvas content */
  cursor: crosshair;
  /* Add transition for background color */
  transition: background-color 0.3s ease;
`;

export const EditorSidebar = styled.div`
  /* Responsive width */
  width: clamp(200px, 25vw, 250px);
  height: 100%; /* Full height of the EditorMainArea */
  background-color: ${props => getInactiveColor(props.isInverted)}dd; /* Semi-transparent */
  border-left: 1px solid ${props => getActiveColor(props.isInverted)}30;
  /* Responsive padding */
  padding: clamp(15px, 2vw, 20px);
  overflow-y: auto; /* Allow sidebar content to scroll */
  transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
  z-index: 5; /* Ensure it's above canvas but below modals */

  /* Styles for small screens (collapsible) */
  @media (max-width: 640px) {
    position: absolute; /* Position absolutely for sliding effect */
    right: 0;
    top: 0;
    /* Use 100% height of parent */
    height: 100%;
    /* Adjust width slightly for smaller screens */
    width: clamp(180px, 50vw, 220px);
    /* Slide in/out based on isCollapsed prop */
    transform: translateX(${props => props.isCollapsed ? '100%' : '0'});
    border-left: none; /* Remove border when absolute */
    border-right: 1px solid ${props => getActiveColor(props.isInverted)}30; /* Add border to the visible edge */
  }
`;

// Button to toggle sidebar visibility on small screens
export const SidebarToggleButton = styled(ToolbarItem)`
  /* Position fixed or absolute if needed, or place in toolbar */
  /* Example: Fixed positioning */
  position: fixed;
  bottom: clamp(10px, 2vh, 15px);
  right: clamp(10px, 2vw, 15px);
  z-index: 15; /* Above sidebar */
  display: none; /* Hidden by default */

  @media (max-width: 640px) {
    display: block; /* Show only on small screens */
  }
`;


export const SidebarTitle = styled.h2`
  color: ${props => getActiveColor(props.isInverted)};
  /* Responsive font size */
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  /* Responsive margin */
  margin-bottom: clamp(15px, 3vh, 20px);
  text-align: center;
  transition: color 0.3s ease;
`;

export const ElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* Responsive gap */
  gap: clamp(8px, 1.5vh, 10px);
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
  /* Responsive padding */
  padding: clamp(8px, 1.5vh, 10px);
  text-align: left;
  font-family: 'Excalifont';
  /* Responsive font size */
  font-size: clamp(0.75rem, 2vw, 0.9rem);
  cursor: pointer;
  transition: all 0.2s;
  display: flex; /* Use flex for icon + text alignment */
  align-items: center; /* Vertically align icon and text */
  gap: 8px; /* Space between icon and text */

  &:hover {
    background-color: ${props => getActiveColor(props.isInverted)}20;
  }

  /* Style for the visual representation of the element */
  .element-icon {
    flex-shrink: 0; /* Prevent icon from shrinking */
    /* Add specific styles for different icons if needed */
    div { /* Target inner divs used for icons */
       min-width: clamp(20px, 5vw, 30px);
       height: auto;
    }
  }
`;

// --- Save Dialog Styles ---

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
  /* Responsive padding for the overlay */
  padding: clamp(15px, 3vw, 20px);
`;

export const SaveDialogContent = styled.div`
  background-color: ${props => getInactiveColor(props.isInverted)};
  border: 2px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 10px;
  /* Responsive padding */
  padding: clamp(20px, 4vw, 30px);
  /* Responsive width with min/max */
  width: clamp(280px, 80vw, 400px);
  max-width: 90%; /* Ensure it doesn't exceed screen width */
  transition: background-color 0.3s ease, border-color 0.3s ease;

  h2 {
    color: ${props => getActiveColor(props.isInverted)};
    /* Responsive font size */
    font-size: clamp(1.2rem, 5vw, 1.5rem);
    /* Responsive margin */
    margin-bottom: clamp(15px, 3vh, 20px);
    text-align: center;
    transition: color 0.3s ease;
  }

  p {
    color: ${props => getActiveColor(props.isInverted)};
    /* Responsive font size */
    font-size: clamp(0.9rem, 3vw, 1rem);
    /* Responsive margin */
    margin-bottom: clamp(10px, 2vh, 15px);
    transition: color 0.3s ease;
  }
`;

export const Input = styled.input`
  width: 100%;
  /* Responsive padding */
  padding: clamp(8px, 1.5vw, 10px);
  background-color: ${props => getInactiveColor(props.isInverted)};
  color: ${props => getActiveColor(props.isInverted)};
  border: 1px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 5px;
  /* Responsive margin */
  margin-bottom: clamp(15px, 3vh, 20px);
  font-family: 'Excalifont';
  /* Responsive font size */
  font-size: clamp(0.9rem, 3vw, 1rem);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => getActiveColor(props.isInverted)};
    box-shadow: 0 0 0 2px ${props => getActiveColor(props.isInverted)}40;
  }

  &::placeholder {
    color: ${props => getActiveColor(props.isInverted)}80;
    opacity: 0.7;
  }
`;

export const SaveDialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  /* Responsive gap */
  gap: clamp(8px, 2vw, 10px);

  /* Stack buttons vertically on very narrow screens */
  @media (max-width: 350px) {
    flex-direction: column;
    align-items: stretch; /* Make buttons full width */
  }

  button {
    /* Responsive padding */
    padding: clamp(8px, 1.5vh, 10px) clamp(12px, 3vw, 15px);
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Excalifont';
    /* Responsive font size */
    font-size: clamp(0.8rem, 2.5vw, 0.9rem);
    transition: all 0.2s;
    border: 1px solid ${props => getActiveColor(props.isInverted)};
    background-color: transparent;
    color: ${props => getActiveColor(props.isInverted)};

    &:hover:not(:disabled) {
      background-color: ${props => getActiveColor(props.isInverted)};
      color: ${props => getInactiveColor(props.isInverted)};
    }

    /* Style for the primary action button (Save) */
    &:last-child:not(:disabled) {
      background-color: ${props => getActiveColor(props.isInverted)};
      color: ${props => getInactiveColor(props.isInverted)};
      border-color: ${props => getActiveColor(props.isInverted)};

      &:hover {
        opacity: 0.85;
      }
    }

    &:disabled {
      background-color: #cccccc !important;
      color: #666666 !important;
      border-color: #cccccc !important;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

// --- END OF FILE LevelEditor.styles.js ---