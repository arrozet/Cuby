import React from 'react';
import { ControlsContainer } from './Controls.styles';

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
    <ControlsContainer>
      <p>A/D: Move | Space: Jump | C: Invert Colors | R: Restart</p>
    </ControlsContainer>
  );
};

export default Controls;