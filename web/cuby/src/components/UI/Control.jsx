import React from 'react';

/**
 * Componente Controls - Muestra los controles del juego en pantalla
 * 
 * Este componente renderiza una barra de información semi-transparente
 * que muestra los controles básicos del juego al usuario:
 * - A/D: Movimiento horizontal
 * - Espacio: Saltar
 * - C: Invertir colores
 * - R: Reiniciar nivel
 * 
 * @component
 */
const Controls = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '14px',
      zIndex: 100,
      userSelect: 'none', // Evitar que el texto sea seleccionable
      pointerEvents: 'none' // Evitar que interfiera con los controles del juego
    }}>
      <p>A/D: Move | Space: Jump | C: Invert Colors | R: Restart</p>
    </div>
  );
};

export default Controls;