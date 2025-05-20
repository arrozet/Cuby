import styled from 'styled-components';

export const ControlsContainer = styled.div`
  position: absolute;
  top: 50%; /* Posiciona el inicio del contenedor en el centro vertical */
  left: 20px; /* Mantiene el contenedor a la izquierda */
  transform: translateY(-50%); /* Centra el contenedor verticalmente */
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  font-family: monospace;
  font-size: 14px;
  z-index: 100;
  user-select: none;
  pointer-events: none;

  /* Estilos para cada línea de control */
  p {
    margin: 5px 0; /* Añade un pequeño espacio entre las líneas de control */
    white-space: nowrap; /* Evita que las líneas largas se dividan */
  }

  /* Ocultar en dispositivos móviles */
  @media (max-width: 1024px) {
    display: none;
  }
`;