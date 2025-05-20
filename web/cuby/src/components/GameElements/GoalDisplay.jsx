import React from 'react';
import { Goal as StyledGoal } from './GameElements.styles';
import { Goal } from './GameElements'; // Para defaults

const GoalDisplay = ({ x, y, width = Goal.defaultWidth, height = Goal.defaultHeight, $isInverted }) => {
  // StyledGoal ya usa getActiveColor internamente para su borde
  return (
    <StyledGoal
      x={x}
      y={y}
      width={width}
      height={height}
      $isInverted={$isInverted}
    />
  );
};

export default GoalDisplay;