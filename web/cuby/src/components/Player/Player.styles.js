import styled from 'styled-components';
import { getActiveColor } from '../../utils/colors';

export const PlayerContainer = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  background-color: ${props => getActiveColor(props.isInverted)};
  transition: background-color 0.3s;
  z-index: 10;
`;
