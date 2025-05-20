import React from 'react';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const PlayerStartDisplay = ({ x, y, $isInverted }) => {
  const playerSize = 40; // Como lo tenías en LevelEditor.jsx
  const activeColor = getActiveColor($isInverted);
  // const inactiveColor = getInactiveColor($isInverted); // Para un borde si quieres

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: playerSize,
        height: playerSize,
        backgroundColor: activeColor,
        opacity: 0.7,
        // Ejemplo de borde:
        // border: `2px solid ${inactiveColor}`,
        // borderRadius: '5px',
        boxSizing: 'border-box',
        pointerEvents: 'none',
      }}
    />
  );
};

export default PlayerStartDisplay;