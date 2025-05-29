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
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  z-index: 100;
  padding: 8px;
  transition: background-color 0.3s ease;
  
  .gear-icon {
    width: 32px;
    height: 32px;
    transition: all 0.3s ease;
  }
  
  &:hover .gear-icon {
    animation: ${rotate} 3s linear infinite;
  }

  span {
    color: ${props => props.$isInverted ? '#000000' : '#FFFFFF'};
    font-family: 'Excalifont';
    font-size: 1.2rem;
  }
`;