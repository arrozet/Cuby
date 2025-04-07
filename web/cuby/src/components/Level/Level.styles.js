import styled from 'styled-components';

export const LevelContainer = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => props.isInverted ? 'black' : 'white'};
  transition: background-color 0.3s;
  overflow: hidden;
`;