import styled from 'styled-components';

export const GameContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: ${props => props.width}px;
  height: ${props => props.height}px;
  margin: 0 auto;
  border: 2px solid #333;
  overflow: hidden;
  
  @media (max-width: 850px) {
    max-width: 100%;
    height: 70vh;
  }
`;

export const WinMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 36px;
  font-family: sans-serif;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 3px solid black;
  border-radius: 10px;
  z-index: 100;
  text-align: center;
`;