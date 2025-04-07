import React from 'react';
import { LevelContainer, Platform, Obstacle, Trampoline, Portal, Goal } from './Level.styles';
import { level1 } from '../../levels/level1';

const Level = ({ isInverted, width, height, level = level1 }) => {
  return (
    <LevelContainer width={width} height={height} isInverted={isInverted}>
      {level.platforms.map((platform, index) => (
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
      
      {level.obstacles.map((obstacle, index) => (
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
      
      {level.trampolines.map((trampoline, index) => (
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
      
      {level.portals.map((portal, index) => (
        <Portal
          key={`portal-${index}`}
          x={portal.x}
          y={portal.y}
          width={portal.width}
          height={portal.height}
          color={portal.color}
          isInverted={isInverted}
        />
      ))}
      
      <Goal
        x={level.goal.x}
        y={level.goal.y}
        width={level.goal.width}
        height={level.goal.height}
        isInverted={isInverted}
      />
    </LevelContainer>
  );
};

export default Level;
