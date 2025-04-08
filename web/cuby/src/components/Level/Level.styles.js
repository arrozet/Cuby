import styled from 'styled-components';
import { getActiveColor } from '../../utils/colors';

export const LevelContainer = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => getActiveColor(!props.isInverted)};
  transition: background-color 0.3s;
  overflow: hidden;
  z-index: 1;
`;