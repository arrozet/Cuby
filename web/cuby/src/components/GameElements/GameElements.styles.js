import styled from 'styled-components';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

export const Platform = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor: props.color === getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent',
    border: props.color === getActiveColor(props.$isInverted) ? '1px solid #333' : 'none'
  }
}))`
  position: absolute;
  display: block;
  transition: background-color 0.3s;
`;

export const Obstacle = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor: props.color === getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent'
  }
}))`
  position: absolute;
  display: block;
  
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: 0;
    width: 0;
    height: 0;
    border-left: ${props => props.width / 2}px solid transparent;
    border-right: ${props => props.width / 2}px solid transparent;
    border-bottom: 10px solid ${props => 
      props.color === getActiveColor(props.$isInverted) ? 
        getActiveColor(props.$isInverted) : 'transparent'};
  }
`;

export const Trampoline = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor: props.color === getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent',
    borderBottom: `5px solid ${props.color === getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent'}`
  }
}))`
  position: absolute;
  display: block;
  border-radius: 50% 50% 0 0;
`;

export const Portal = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor: props.color === getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent'
  }
}))`
  position: absolute;
  display: block;
  border-radius: 8px;
  opacity: 0.8;
  animation: pulse 1.5s infinite;
  
  &::after {
    content: '◊';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${props => props.width * 0.5}px;
    color: ${props => getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent'};
    opacity: 0.6;
    animation: float 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { transform: scaleY(1); }
    50% { transform: scaleY(1.1); }
    100% { transform: scaleY(1); }
  }

  @keyframes float {
    0% { transform: translate(-50%, -50%) translateY(0); }
    50% { transform: translate(-50%, -50%) translateY(-5px); }
    100% { transform: translate(-50%, -50%) translateY(0); }
  }
`;

export const Goal = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    border: `3px dashed ${getActiveColor(props.$isInverted)}`
  }
}))`
  position: absolute;
  display: block;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;