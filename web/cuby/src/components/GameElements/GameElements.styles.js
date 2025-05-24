import styled from 'styled-components';
import { getActiveColor } from '../../utils/colors';

export const Platform = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `rgba(0,0,0,0.15)`
        : props.color === getActiveColor(props.$isInverted)
          ? getActiveColor(props.$isInverted)
          : 'transparent',
    border:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` :
      props.color === getActiveColor(props.$isInverted)
        ? '1px solid #333' : 'none'
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
    backgroundColor:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `rgba(0,0,0,0.25)`
        : props.color === getActiveColor(props.$isInverted)
          ? getActiveColor(props.$isInverted)
          : 'transparent',
    border:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` : 'none'
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
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `rgba(0,0,0,0.25)`
        : props.color === getActiveColor(props.$isInverted)
          ? getActiveColor(props.$isInverted)
          : 'transparent'};
    z-index: 1;
  }
  
  /* Borde discontinuo para el triángulo de la silueta */
  &:after {
    content: '';
    display: ${props => props.$showSilhouette && props.color !== getActiveColor(props.$isInverted) ? 'block' : 'none'};
    position: absolute;
    top: -12px;
    left: -2px;
    width: 0;
    height: 0;
    border-left: ${props => props.width / 2 + 2}px solid transparent;
    border-right: ${props => props.width / 2 + 2}px solid transparent;
    border-bottom: 14px dashed #888;
    z-index: 0;
  }
`;

export const Trampoline = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
    backgroundColor:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `rgba(0,0,0,0.15)`
        : props.color === getActiveColor(props.$isInverted)
          ? getActiveColor(props.$isInverted)
          : 'transparent',
    // CORREGIR: Usar solo borderTop, borderRight, borderLeft, borderBottom en lugar de border (conflicto entre propiedades CSS de borde)
    borderTop:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` :
      props.color === getActiveColor(props.$isInverted)
        ? '1px solid #333' : 'none',
    borderRight:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` :
      props.color === getActiveColor(props.$isInverted)
        ? '1px solid #333' : 'none',
    borderBottom:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` :
      props.color === getActiveColor(props.$isInverted)
        ? '1px solid #333' : 'none',
    borderLeft:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` :
      props.color === getActiveColor(props.$isInverted)
        ? '1px solid #333' : 'none'
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
    backgroundColor:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `rgba(0,0,0,0.15)`
        : props.color === getActiveColor(props.$isInverted)
          ? getActiveColor(props.$isInverted)
          : 'transparent',
    border:
      props.$showSilhouette && props.color !== getActiveColor(props.$isInverted)
        ? `2px dashed #888` :
      props.color === getActiveColor(props.$isInverted)
        ? 'none' : `2px dashed ${getActiveColor(props.$isInverted)}50`
  }
}))`
  position: absolute;
  display: block;
  border-radius: 8px;
  opacity: ${props => props.color === getActiveColor(props.$isInverted) ? 0.8 : 0.5};
  animation: ${props => props.color === getActiveColor(props.$isInverted) ? 'pulse 1.5s infinite' : 'none'};

  @keyframes pulse {
    0% { transform: scaleY(1); }
    50% { transform: scaleY(1.1); }
    100% { transform: scaleY(1); }
  }
`;

export const DiamondShape = styled.div.attrs(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    width: `${props.width}px`,
    height: `${props.height}px`,
  }
}))`
  position: absolute;
  display: block;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => props.color === getActiveColor(props.$isInverted) ? 
      getActiveColor(props.$isInverted) : 'transparent'};
    border: ${props => props.color === getActiveColor(props.$isInverted) ? 
      'none' : `2px dashed ${getActiveColor(props.$isInverted)}50`};
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    opacity: ${props => props.color === getActiveColor(props.$isInverted) ? 0.8 : 0.5};
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