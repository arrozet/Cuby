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

export const LevelCard = styled.div.attrs(props => ({
  style: {
    backgroundColor: props.locked ? '#333' : getActiveColor(props.$isInverted),
    borderColor: getActiveColor(props.$isInverted),
    color: getInactiveColor(props.$isInverted),
    cursor: props.locked ? 'not-allowed' : 'pointer',
    transform: (!props.locked && props.hover) ? 'scale(1.05)' : 'scale(1)'
  }
}))`
  width: 150px;
  height: 150px;
  border: 3px solid;
  border-radius: 20px; /* Esquinas redondeadas en lugar de círculo */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: transform 0.2s, background-color 0.3s;
  
  &:hover {
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

export const UserLevelsButton = styled.button`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  border: none;
  border-radius: 10px;
  padding: 12px 25px;
  font-size: 18px;
  font-family: 'Excalifont';
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  
  &:hover {
    transform: translateX(-50%) scale(1.05);
    opacity: 0.9;
  }
`;