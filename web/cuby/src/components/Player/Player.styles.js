import styled, { keyframes } from 'styled-components';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const blink = keyframes`
  0%, 95%, 100% {
    transform: translateY(-50%) scaleY(1);
  }
  97.5% {
    transform: translateY(-50%) scaleY(0.1);
  }
`;

const explode = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const particleAnimation = keyframes`
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
`;

export const PlayerContainer = styled.div.attrs(props => ({
  style: {
    width: `${props.size}px`,
    height: `${props.size}px`,
    left: `${props.x}px`,
    top: `${props.y}px`,
    backgroundColor: getActiveColor(props.$isInverted)
  }
}))`
  position: absolute;
  transition: background-color 0.3s;
  z-index: 10;
`;

export const ExplosionContainer = styled.div.attrs(props => ({
  style: {
    width: `${props.size}px`,
    height: `${props.size}px`,
    left: `${props.x}px`,
    top: `${props.y}px`,
    backgroundColor: getActiveColor(props.$isInverted)
  }
}))`
  position: absolute;
  z-index: 9;
  animation: ${explode} 0.5s ease-out forwards;
`;

export const ExplosionParticle = styled.div.attrs(props => ({
  style: {
    '--tx': `${props.tx}px`,
    '--ty': `${props.ty}px`,
    backgroundColor: getActiveColor(props.$isInverted),
    width: `${Math.random() * 4 + 4}px`,
    height: `${Math.random() * 4 + 4}px`,
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
}))`
  position: absolute;
  border-radius: 50%;
  animation: ${particleAnimation} 0.5s ease-out forwards;
`;

export const Eye = styled.div.attrs(props => ({
  style: {
    backgroundColor: getInactiveColor(props.$isInverted)
  }
}))`
  width: 8px;
  height: 8px;
  transition: background-color 0.3s;
  position: absolute;
  top: 35%;
  transform: translateY(-50%);
  animation: ${blink} 5s infinite;
  
  &:first-child {
    left: 20%;
  }
  
  &:last-child {
    right: 20%;
  }
`;
