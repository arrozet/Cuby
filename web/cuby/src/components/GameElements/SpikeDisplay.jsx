import React from 'react';
import { Obstacle as StyledSpike } from './GameElements.styles'; // Usamos el Obstacle modificado
// Importamos la clase Spike original para los valores por defecto
import { Spike } from './GameElements';

const SpikeDisplay = ({ x, y, width = Spike.defaultWidth, height = Spike.defaultHeight, color, $isInverted }) => {
  return (
    <StyledSpike
      x={x}
      y={y} // Esta 'y' es la base del pincho
      width={width}
      height={height}
      color={color}
      $isInverted={$isInverted}
    />
  );
};

export default SpikeDisplay;