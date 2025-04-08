import styled, { keyframes } from 'styled-components';
import LayeredText from '../common/LayeredText/LayeredText';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const StartContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isInverted ? 'white' : 'black'};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
`;

export const GameTitle = styled(LayeredText)`
  margin-bottom: 50px;
`;

export const StartButtonContainer = styled.div`
  padding: 15px 30px;
  animation: ${pulse} 1.5s infinite ease-in-out;
  transition: all 0.3s ease;
  margin-top: 50px;
`;

export const StartButtonText = styled(LayeredText)`
  transition: all 0.3s ease;
`;