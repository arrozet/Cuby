import React from 'react';
import { Platform as StyledPlatform } from './GameElements.styles';
// No necesitamos getActiveColor aquí porque StyledPlatform ya lo maneja internamente.

const PlatformDisplay = ({ x, y, width, height, color, $isInverted, style, $showSilhouette }) => {
  return (
    <StyledPlatform
      x={x}
      y={y}
      width={width}
      height={height}
      color={color} // El color lógico de la plataforma
      $isInverted={$isInverted} // Para que StyledPlatform decida cómo mostrarse
      style={style}
      $showSilhouette={$showSilhouette}
    />
  );
};

export default PlatformDisplay;