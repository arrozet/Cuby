import React from 'react';
import { PlayerContainer } from './Player.styles';

/**
 * Componente Player - Representa al personaje principal del juego
 * 
 * Este componente es responsable de renderizar el cubo que representa
 * al jugador. El cubo cambia de color según el estado de inversión
 * del juego.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {number} props.x - Posición horizontal del jugador
 * @param {number} props.y - Posición vertical del jugador
 * @param {number} props.size - Tamaño del cubo del jugador (ancho y alto)
 * @param {boolean} props.isInverted - Estado de inversión de color
 */
const Player = ({ x, y, size, isInverted }) => {
  return (
    <PlayerContainer
      x={x}
      y={y}
      size={size}
      isInverted={isInverted}
    />
  );
};

export default Player;