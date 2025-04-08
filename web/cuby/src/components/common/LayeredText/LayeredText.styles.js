import styled from 'styled-components';

export const LayeredTextContainer = styled.div`
  position: relative;
  margin-bottom: ${props => props.marginBottom};
`;

export const TextLayer = styled.div`
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  letter-spacing: ${props => props.letterSpacing};
  line-height: 1.2;
  text-align: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  white-space: nowrap;
  user-select: none;

  &.back {
    color: ${props => props.isInverted ? props.middleColor : props.backColor};
    transform: translate(calc(-50% - ${props => props.offset * 2}px), calc(-50% + ${props => props.offset}px));
  }

  &.middle {
    color: ${props => props.isInverted ? props.frontColor : props.middleColor};
    transform: translate(calc(-50% - ${props => props.offset * 1.25}px), calc(-50% + ${props => props.offset/2}px));
  }

  &.front {
    color: ${props => props.isInverted ? props.middleColor : props.frontColor};
  }
`;