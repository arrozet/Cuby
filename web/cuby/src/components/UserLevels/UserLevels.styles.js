import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const UserLevelsContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  padding: 80px 20px 20px;
  position: relative;
`;

export const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 40px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
`;

export const LevelsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  overflow-y: auto;
  padding: 20px;
`;

export const LevelCard = styled.div`
  background-color: ${props => getActiveColor(props.$isInverted)}20;
  border: 2px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 10px;
  padding: 20px;
  color: ${props => getActiveColor(props.$isInverted)};
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 14px;
    margin-bottom: 15px;
    opacity: 0.8;
  }
  
  .actions {
    display: flex;
    justify-content: space-between;
    
    button {
      background-color: ${props => getActiveColor(props.$isInverted)};
      color: ${props => getInactiveColor(props.$isInverted)};
      border: none;
      border-radius: 5px;
      padding: 8px 12px;
      cursor: pointer;
      font-family: 'Excalifont';
      font-size: 14px;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

export const ActionButton = styled.button`
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  border: none;
  border-radius: 10px;
  padding: 15px 25px;
  font-size: 20px;
  font-family: 'Excalifont';
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
    /* Mantenemos los mismos colores, solo cambiamos escala y opacidad */
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }
`;

export const ButtonContainer = styled.div`
  margin-bottom: 30px;
`;

export const NoLevelsMessage = styled.p`
  font-size: 24px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
  margin-top: 40px;
`;