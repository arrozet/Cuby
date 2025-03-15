import React from 'react';
import { LevelContainer, Platform, Obstacle, Trampoline, Goal } from './Level.styles';
import { level1 } from '../../levels/level1';

const Level = ({ isInverted, width, height }) => {
  return (
    <LevelContainer width={width} height={height} isInverted={isInverted}>
      {level1.platforms.map((platform, index) => (
        <Platform
          key={`platform-${index}`}
          x={platform.x}
          y={platform.y}
          width={platform.width}
          height={platform.height}
          color={platform.color}
          isInverted={isInverted}
        />
      ))}
      
      {level1.obstacles.map((obstacle, index) => (
        <Obstacle
          key={`obstacle-${index}`}
          x={obstacle.x}
          y={obstacle.y}
          width={obstacle.width}
          height={obstacle.height}
          color={obstacle.color}
          isInverted={isInverted}
        />
      ))}
      
      {level1.trampolines.map((trampoline, index) => (
        <Trampoline
          key={`trampoline-${index}`}
          x={trampoline.x}
          y={trampoline.y}
          width={trampoline.width}
          height={trampoline.height}
          color={trampoline.color}
          isInverted={isInverted}
        />
      ))}
      
      <Goal
        x={level1.goal.x}
        y={level1.goal.y}
        width={level1.goal.width}
        height={level1.goal.height}
        isInverted={isInverted}
      />
    </LevelContainer>
  );
};

export default Level;
