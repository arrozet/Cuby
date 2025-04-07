import styled, { keyframes } from 'styled-components';

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
  background-color: ${props => props.isInverted ? 'black' : 'white'};
  font-family: 'Press Start 2P', cursive;
  transition: background-color 0.3s ease;
`;

export const GameLogo = styled.div`
  font-size: 120px;
  margin-bottom: 30px;
  font-weight: bold;
  letter-spacing: 10px;
  color: ${props => props.isInverted ? 'white' : 'black'};
  text-align: center;
  transition: color 0.3s ease;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 50px;
  color: ${props => props.isInverted ? 'white' : '#333'};
  text-align: center;
  transition: color 0.3s ease;
`;

export const StartButton = styled.div`
  font-size: 20px;
  padding: 15px 30px;
  border: 2px solid ${props => props.isInverted ? 'white' : 'black'};
  border-radius: 10px;
  color: ${props => props.isInverted ? 'white' : 'black'};
  cursor: pointer;
  animation: ${pulse} 1.5s infinite ease-in-out;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isInverted ? 'white' : 'black'};
    color: ${props => props.isInverted ? 'black' : 'white'};
  }
`;