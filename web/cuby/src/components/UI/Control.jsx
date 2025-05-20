import React from 'react';
import { ControlsContainer } from './Controls.styles';
import { useSettings } from '../../context/SettingsContext';

/**
 * Componente Controls - Muestra los controles del juego en pantalla
 * 
 * Este componente renderiza una barra de información semi-transparente
 * que muestra los controles básicos del juego al usuario.
 * 
 * @component
 */
const Controls = () => {
  const { keyMapping } = useSettings(); // Get keyMapping from settings

  let controlElements;

  if (keyMapping) {
    const controlsList = [
      `${keyMapping.left?.display || 'A'}/${keyMapping.right?.display || 'D'}: Moverse`,
      `${keyMapping.jumpAlt?.display || 'Space'}: Saltar`,
      `${keyMapping.invertColors?.display || 'E'}: Invertir colores`,
      `${keyMapping.restart?.display || 'R'}: Reiniciar`
    ];

    controlElements = controlsList.map((controlText, index) => (
      <p key={index}>{controlText}</p>
    ));
  } else {
    controlElements = <p>Cargando controles...</p>;
  }

  return (
    <ControlsContainer>
      {controlElements}
    </ControlsContainer>
  );
};

export default Controls;