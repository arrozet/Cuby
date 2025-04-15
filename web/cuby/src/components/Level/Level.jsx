import React from 'react';
import { LevelContainer } from './Level.styles';
import { Platform, Obstacle, Trampoline, Portal, Goal } from '../GameElements/GameElements.styles';
import { level1 } from '../../levels/level1';
import { useInversion } from '../../context/InversionContext';

/**
 * Componente Level - Renderiza el nivel actual del juego
 * 
 * Este componente maneja:
 * - La renderización de todas las plataformas del nivel
 * - La renderización de obstáculos (picos)
 * - La renderización de trampolines
 * - La renderización de portales
 * - La renderización del objetivo (meta)
 * 
 * El sistema de color invertido afecta a todos los elementos:
 * - Solo se pueden usar las plataformas/objetos del color actual
 * - Los elementos del color opuesto son atravesables
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {number} props.width - Ancho del nivel
 * @param {number} props.height - Alto del nivel
 * @param {Object} props.level - Datos del nivel (plataformas, obstáculos, etc.)
 */
const Level = ({ width, height, level = level1 }) => {
  // Usar el contexto global en lugar del prop
  const { isInverted } = useInversion();

  return (
    <LevelContainer width={width} height={height} $isInverted={isInverted}>
      {/* Renderizado de plataformas */}
      {level.platforms.map((platform, index) => (
        <Platform
          key={`platform-${index}`}
          x={platform.x}
          y={platform.y}
          width={platform.width}
          height={platform.height}
          color={platform.color}
          $isInverted={isInverted}
        />
      ))}
      
      {/* Renderizado de obstáculos (picos) */}
      {level.obstacles.map((obstacle, index) => (
        <Obstacle
          key={`obstacle-${index}`}
          x={obstacle.x}
          y={obstacle.y}
          width={obstacle.width}
          height={obstacle.height}
          color={obstacle.color}
          $isInverted={isInverted}
        />
      ))}
      
      {/* Renderizado de trampolines */}
      {level.trampolines.map((trampoline, index) => (
        <Trampoline
          key={`trampoline-${index}`}
          x={trampoline.x}
          y={trampoline.y}
          width={trampoline.width}
          height={trampoline.height}
          color={trampoline.color}
          $isInverted={isInverted}
        />
      ))}
      
      {/* Renderizado de portales */}
      {level.portals.map((portal, index) => (
        <Portal
          key={`portal-${index}`}
          x={portal.x}
          y={portal.y}
          width={portal.width}
          height={portal.height}
          color={portal.color}
          $isInverted={isInverted}
        />
      ))}
      
      {/* Renderizado del objetivo (meta) */}
      <Goal
        x={level.goal.x}
        y={level.goal.y}
        width={level.goal.width}
        height={level.goal.height}
        $isInverted={isInverted}
      />
    </LevelContainer>
  );
};

export default Level;
