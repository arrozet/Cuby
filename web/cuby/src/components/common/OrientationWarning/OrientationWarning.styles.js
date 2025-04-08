import styled, { keyframes } from 'styled-components';

const rotateAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(-90deg);
  }
  85% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

const pulseAnimation = keyframes`
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
`;

export const RotateDeviceOverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  color: white;
  font-family: 'Excalifont', 'Arial';
  text-align: center;
  padding: 20px;
`;

export const PhoneIconElement = styled.div`
  width: 120px;
  height: 220px;
  border: 3px solid white;
  border-radius: 20px;
  position: relative;
  margin: 30px 0;
  animation: ${rotateAnimation} 3s infinite;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    height: 75%;
    background-color: rgba(255, 255, 255, 0.59);
    border: 2px solid white;
    border-radius: 4px;
    animation: ${pulseAnimation} 2s infinite;
  }
`;

export const RotateTextElement = styled.p`
  font-size: 30px;
  margin: 10px 0;
  font-weight: normal;
  letter-spacing: 1px;
  opacity: 0.9;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
`;