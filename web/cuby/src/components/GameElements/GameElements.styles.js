import styled, { css } from 'styled-components';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const baseStyles = css`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.color === getActiveColor(props.isInverted) ? 
    getActiveColor(props.isInverted) : 'transparent'};
  display: 'block';
`;

export const Platform = styled.div`
  ${baseStyles}
  border: ${props => 
    props.color === getActiveColor(props.isInverted) ? '1px solid #333' : 'none'};
  transition: background-color 0.3s;
`;

export const Obstacle = styled.div`
  ${baseStyles}
  
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
      props.color === getActiveColor(props.isInverted) ? 
        getActiveColor(props.isInverted) : 'transparent'};
  }
`;

export const Trampoline = styled.div`
  ${baseStyles}
  border-bottom: 5px solid ${props => 
    props.color === getActiveColor(props.isInverted) ? 
      getActiveColor(props.isInverted) : 'transparent'};
  border-radius: 50% 50% 0 0;
`;

export const Portal = styled.div`
  ${baseStyles}
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
    color: ${props => getActiveColor(props.isInverted) ? 
      getActiveColor(props.isInverted) : 'transparent'};
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

export const Goal = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  border: 3px dashed ${props => getActiveColor(props.isInverted)};
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