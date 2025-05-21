import React from 'react';
import { Trampoline as StyledTrampoline } from './GameElements.styles';
import { Trampoline } from './GameElements'; // Para defaults

const TrampolineDisplay = ({ x, y, width = Trampoline.defaultWidth, height = Trampoline.defaultHeight, color, $isInverted, style, $showSilhouette }) => {
  return (
    <StyledTrampoline
      x={x}
      y={y}
      width={width}
      height={height}
      color={color}
      $isInverted={$isInverted}
      style={style}
      $showSilhouette={$showSilhouette}
    />
  );
};

export default TrampolineDisplay;