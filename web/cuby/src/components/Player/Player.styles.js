import styled from 'styled-components';

export const PlayerContainer = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background-color: ${props => props.isInverted ? 'white' : 'black'};
  transition: background-color 0.3s;
`;
