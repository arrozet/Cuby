import styled from 'styled-components';
import { getInactiveColor } from '../../utils/colors';

export const LevelContainer = styled.div`
  position: relative;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  transition: background-color 0.3s;
  overflow: hidden;
  z-index: 1;
`;