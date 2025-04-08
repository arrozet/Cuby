import styled from 'styled-components';

export const LevelSelectContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: black;
  font-family: 'Press Start 2P', cursive;
`;

export const Title = styled.h1`
  font-size: 36px;
  margin-bottom: 60px;
  color: white;
  text-align: center;
`;

export const LevelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 150px);
  gap: 30px;
  justify-content: center;
  max-width: 600px;
`;

export const LevelCard = styled.div`
  width: 150px;
  height: 150px;
  background-color: ${props => props.locked ? '#333' : 'black'};
  border: 3px solid white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.locked ? 'not-allowed' : 'pointer'};
  position: relative;
  transition: transform 0.2s;
  color: white;
  
  &:hover {
    transform: ${props => !props.locked && 'scale(1.05)'};
  }
  
  .level-number {
    font-size: 48px;
    font-weight: bold;
  }
  
  .lock-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
  }
`;

export const BackButton = styled.button`
  margin-top: 40px;
  padding: 15px 30px;
  background-color: black;
  border: 3px solid white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  font-family: 'Press Start 2P', cursive;
  color: white;
  
  &:hover {
    background-color: white;
    color: black;
  }
`;