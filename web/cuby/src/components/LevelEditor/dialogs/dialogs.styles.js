import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../../utils/colors';

// --- SaveDialog, SaveDialogContent, Input, SaveDialogButtons sin cambios ---
export const SaveDialog = styled.div.attrs(props => ({
    onClick: props.onClick
}))`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const SaveDialogContent = styled.div`
  background-color: ${props => props.$isInverted ? '#222' : '#fff'};
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  color: ${props => props.$isInverted ? '#fff' : '#333'};

  h2 {
    color: ${props => props.$isInverted ? '#fff' : '#333'};
    margin-top: 0;
  }

  p {
    color: ${props => props.$isInverted ? '#fff' : '#333'};
    margin: 10px 0;
  }
`;

export const Input = styled.input`
  width: 100%; padding: 10px 12px; margin-bottom: 25px;
  border: 1px solid ${props => getActiveColor(props.$isInverted)}60;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  color: ${props => getActiveColor(props.$isInverted)};
  border-radius: 5px; font-family: 'Excalifont'; font-size: 1rem;
  box-sizing: border-box; outline: none;
  &:focus {
    border-color: ${props => getActiveColor(props.$isInverted)};
    box-shadow: 0 0 5px ${props => getActiveColor(props.$isInverted)}40;
  }
`;

export const SaveDialogButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;

  button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-family: 'Excalifont';
    background-color: ${props => props.$isInverted ? '#444' : '#f0f0f0'};
    color: ${props => props.$isInverted ? '#fff' : '#333'};
    
    &:hover {
      background-color: ${props => props.$isInverted ? '#555' : '#e0e0e0'};
    }
  }
`;