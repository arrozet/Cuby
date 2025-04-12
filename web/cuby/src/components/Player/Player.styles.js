import styled from 'styled-components';
import { getActiveColor } from '../../utils/colors';

export const PlayerContainer = styled.div.attrs(props => ({
  style: {
    width: `${props.size}px`,
    height: `${props.size}px`,
    left: `${props.x}px`,
    top: `${props.y}px`,
    backgroundColor: getActiveColor(props.isInverted)
  }
}))`
  position: absolute;
  transition: background-color 0.3s;
  z-index: 10;
`;
