import styled, { keyframes } from 'styled-components';

// Keyframe para la animación de giro
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const SettingsButtonContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  border-radius: 50%;
  padding: 8px;
  transition: background-color 0.3s ease;
  
  .gear-icon {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
  }
  
  &:hover .gear-icon {
    animation: ${rotate} 3s linear infinite;
  }
`;