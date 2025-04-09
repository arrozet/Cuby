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
  background-color: ${props => getInactiveColor(props.isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  position: relative;
`;

export const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 60px;
  color: white;
  text-align: center;
`;

export const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 150px);
  gap: 30px;
  justify-content: center;
  max-width: 600px;
`;

export const LevelCard = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${props => props.locked ? '#333' : getActiveColor(props.isInverted)};
  border: 3px solid ${props => getActiveColor(props.isInverted)};
  border-radius: 20px; /* Esquinas redondeadas en lugar de círculo */
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  position: relative;
  transition: transform 0.2s, background-color 0.3s;
  color: ${props => getInactiveColor(props.isInverted)};
  
  &:hover {
    transform: ${props => !props.locked && 'scale(1.05)'};
    animation: ${props => !props.locked && css`${pulse} 1.5s infinite ease-in-out`};
  }
  
  .level-number {
    font-size: 64px; /* Número más grande */
    font-weight: normal; /* Sin negrita */
  }
  
  .lock-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
  }
`;

export const BackArrowContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  cursor: pointer;
  z-index: 10;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 50px;
    height: auto;
  }
  
  .arrow-icon {
    path:nth-child(2) {
      d: path('M1.5 4H12.5H4');
    }
    
    path {
      transition: 0.25s ease;
    }
  }
  
  &:hover {
    .arrow-icon {
      path:nth-child(1) {
        d: path('M1 4H12V4');
      }
      
      path:nth-child(2) {
        d: path('M1.5 4H12.5H16');
        transform: translateX(-4px);
      }
      
      path:nth-child(3) {
        transform: translateX(-4px);
      }
    }
  }
`;