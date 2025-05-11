// --- START OF FILE LevelEditor.styles.js ---

import styled, { css } from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

// EditorContainer sin cambios
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

// Toolbar y ToolbarGroup sin cambios
export const EditorToolbar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  position: relative;
  box-sizing: border-box;
`;
export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  flex-shrink: 1;
  min-width: 0;

  &.center-group {
    flex-grow: 0; justify-content: center;
    @media (max-width: 700px) { flex-wrap: wrap; }
  }
  &.left-group, &.right-group {
     flex-grow: 0;
     @media (max-width: 450px) { flex-wrap: wrap; }
  }
  &.left-group {}
`;

// ToolbarItem sin cambios
export const ToolbarItem = styled.button`
  background-color: ${props => props.isActive ? (props.isInverted ? 'black' : 'white') : 'transparent'};
  color: ${props => props.isActive ? (props.isInverted ? 'white' : 'black') : getActiveColor(props.isInverted)};
  border: 1px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 5px;
  padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 15px);
  cursor: pointer;
  font-family: 'Excalifont';
  font-size: clamp(12px, 2vw, 14px);
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    ${props => !props.isActive && css`
      background-color: ${props.isInverted ? 'white' : 'black'};
      color: ${props.isInverted ? 'black' : 'white'};
    `}
     ${props => props.isActive && css`
      opacity: 0.85;
    `}
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  ${({ isActive }) => isActive && css` /* box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3); */ `}
`;

// EditorCanvas con lógica de cursor actualizada
export const EditorCanvas = styled.div`
  flex: 1;
  background-color: ${props => getInactiveColor(props.isInverted)};
  position: relative; /* Needed for absolute positioning of children like LevelContentWrapper */
  overflow: hidden;
  /* Cursor logic driven by editorMode and isDragging state */
  cursor: ${props => {
    if (props.editorMode === 'pan') {
      return props.isDragging ? 'grabbing' : 'grab'; // Hand cursor for pan
    } else if (props.editorMode === 'erase') {
      return 'cell'; // Or 'not-allowed' or custom cursor for erase
    } else {
      return 'crosshair'; // Default place mode
    }
  }};
  display: flex; /* Using flex might affect LevelContentWrapper positioning, ensure it's absolute */
  /* Remove justify/align center if LevelContentWrapper handles its own position */
  /* justify-content: center; */
  /* align-items: center; */
  user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

// LevelContentWrapper sin cambios
export const LevelContentWrapper = styled.div`
  position: absolute; /* Use absolute for precise positioning relative to scaled canvas */
  width: ${props => props.logicalWidth || 1200}px;
  height: ${props => props.logicalHeight || 800}px;
  background-color: ${props => getInactiveColor(props.isInverted)}EE;
  border: 1px dashed ${props => getActiveColor(props.isInverted)}50;
  /* transform-origin is set inline now */
  will-change: transform; /* Hint for performance */
  pointer-events: none; /* Allow clicks to pass through to the canvas */
  /* Contained elements should have pointer-events: auto if they need interaction, but these are just visuals */
`;

// ZoomControls sin cambios
export const ZoomControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 20;
`;

// ZoomButton sin cambios
export const ZoomButton = styled(ToolbarItem)`
  padding: 8px;
  font-size: 18px;
  line-height: 1;
  min-width: 35px;
  width: 35px;
  height: 35px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;


// EditorSidebar sin cambios
export const EditorSidebar = styled.div`
  width: 250px;
  height: 100%;
  background: linear-gradient(to bottom,
    ${props => getInactiveColor(props.isInverted)}E9,
    ${props => getInactiveColor(props.isInverted)}CC
  );
  border-left: 1px solid ${props => getActiveColor(props.isInverted)}40;
  padding: 20px 15px;
  overflow-y: auto;
  flex-shrink: 0;
  box-sizing: border-box;
  transition: width 0.3s ease, background 0.3s ease;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 850px) { width: 200px; }
  @media (max-width: 600px) { width: 180px; padding: 15px 10px; }
`;

// SidebarTitle sin cambios
export const SidebarTitle = styled.h2`
  color: ${props => getActiveColor(props.isInverted)};
  font-size: clamp(1.3rem, 4vw, 1.5rem);
  margin-bottom: 25px;
  text-align: center;
  border-bottom: 1px solid ${props => getActiveColor(props.isInverted)}40;
  padding-bottom: 10px;
`;

// ElementsContainer sin cambios
export const ElementsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// *** CORRECTION: ElementButton styles reworked for better selection/hover ***
export const ElementButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: left;
  font-family: 'Excalifont';
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out, border-width 0.1s ease-in-out, padding 0.1s ease-in-out;

  /* Base State */
  background-color: transparent;
  color: ${props => getActiveColor(props.isInverted)};
  border: 1px solid ${props => getActiveColor(props.isInverted)}80; /* Slightly less prominent border */
  padding: 12px 10px;

  /* Selected State */
  ${({ isSelected, isInverted }) => isSelected && css`
    border-width: 2px; /* Thicker border */
    border-color: ${getActiveColor(isInverted)}; /* Prominent border color */
    /* Subtle background: light greyish overlay, works in both modes */
    background-color: ${isInverted ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
    padding: 11px 9px; /* Adjust padding for border */
  `}

  /* Hover State */
  &:hover:not(:disabled) {
    border-color: ${props => getActiveColor(props.isInverted)}; /* Full color border on hover */
    /* Background Inversion (only if not selected) */
    ${props => !props.isSelected && css`
      background-color: ${props.isInverted ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
      color: ${getActiveColor(props.isInverted)}; /* Keep text color active */
    `}
     /* Hovering over a selected button: Make background slightly more prominent */
     ${props => props.isSelected && css`
       background-color: ${props.isInverted ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.1)'};
     `}
  }

  /* Disabled State */
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: transparent;
    border-color: ${props => getActiveColor(props.isInverted)}30;
    color: ${props => getActiveColor(props.isInverted)}70;
  }

  /* Icon Container */
  & > div:first-child {
    flex-shrink: 0;
    display: flex; /* Ensure alignment within icon container */
    align-items: center;
    justify-content: center;
    min-width: 30px; /* Give icon area some space */
  }
`;

// Icon Styles for ElementsSidebar
export const IconWrapper = styled.div`
  /* This is the div that ElementButton styles via & > div:first-child */
  /* It provides alignment and min-width for the icon within the button */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PlatformIcon = styled.div`
  width: 30px;
  height: 10px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.borderColor};
`;

export const SpikeIconContainer = styled.div`
  width: 30px;
  height: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SpikeIconShape = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 20px solid ${props => props.fillColor};
  filter: drop-shadow(0px 0px 1px ${props => props.outlineColor});
`;

export const TrampolineIcon = styled.div`
  width: 30px;
  height: 15px;
  background-color: ${props => props.color};
  border-radius: 15px 15px 0 0;
  border: 1px solid ${props => props.borderColor};
`;

export const PortalIconVisual = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${props => props.color};
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.8;
  border: 1px solid ${props => props.borderColor};
`;

export const PortalSymbol = styled.span`
  color: ${props => props.color};
  font-size: 16px;
`;

export const GoalIcon = styled.div`
  width: 20px;
  height: 20px;
  border: 2px dashed ${props => props.color};
  border-radius: 50%;
`;

export const PlayerStartIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  opacity: 0.7;
`;

// --- SaveDialog, SaveDialogContent, Input, SaveDialogButtons sin cambios ---
export const SaveDialog = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
`;
export const SaveDialogContent = styled.div`
  background-color: ${props => getInactiveColor(props.isInverted)};
  color: ${props => getActiveColor(props.isInverted)};
  padding: 25px 30px; border-radius: 8px;
  border: 1px solid ${props => getActiveColor(props.isInverted)}80;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%; max-width: 400px; box-sizing: border-box;
  text-align: center;
  h2 { margin-top: 0; margin-bottom: 15px; font-size: 1.5rem; }
  p { margin-bottom: 20px; font-size: 1rem; opacity: 0.9; }
`;
export const Input = styled.input`
  width: 100%; padding: 10px 12px; margin-bottom: 25px;
  border: 1px solid ${props => getActiveColor(props.isInverted)}60;
  background-color: ${props => getInactiveColor(props.isInverted)};
  color: ${props => getActiveColor(props.isInverted)};
  border-radius: 5px; font-family: 'Excalifont'; font-size: 1rem;
  box-sizing: border-box; outline: none;
  &:focus {
    border-color: ${props => getActiveColor(props.isInverted)};
    box-shadow: 0 0 5px ${props => getActiveColor(props.isInverted)}40;
  }
`;
export const SaveDialogButtons = styled.div`
  display: flex; justify-content: flex-end; gap: 15px;
  button {
    padding: 10px 20px; border-radius: 5px; border: none; cursor: pointer;
    font-family: 'Excalifont'; font-size: 0.9rem; transition: background-color 0.2s, opacity 0.2s;
    &:first-child { /* Cancelar */
      background-color: transparent; color: ${props => getActiveColor(props.isInverted)};
      border: 1px solid ${props => getActiveColor(props.isInverted)}80;
      &:hover { background-color: ${props => getActiveColor(props.isInverted)}1A; }
    }
    &:last-child { /* Guardar */
      background-color: ${props => getActiveColor(props.isInverted)};
      color: ${props => getInactiveColor(props.isInverted)};
      border: 1px solid ${props => getActiveColor(props.isInverted)};
      &:hover:not(:disabled) { opacity: 0.85; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  }
`;

// --- END OF FILE LevelEditor.styles.js ---