import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const UserLevelsContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  /* Reducimos el padding superior inicial */
  padding: 60px 20px 20px;
  position: relative;
  box-sizing: border-box;

  @media (max-width: 768px) {
    /* Reducimos aún más el padding superior en móvil */
    padding-top: 50px;
  }
`;

export const Title = styled.h1`
  font-size: 48px;
  /* Reducimos el margen inferior inicial */
  margin-bottom: 30px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;

  @media (max-width: 768px) {
    font-size: 32px; // Ligeramente más pequeño en móvil
    /* Reducimos más el margen inferior en móvil */
    margin-bottom: 20px;
  }
`;

// UserLevels.styles.js

// ... (otros styled components sin cambios)

export const LevelsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  /* Restauramos padding horizontal y mantenemos box-sizing */
  padding: 10px 20px;
  box-sizing: border-box;

  /* --- CORRECCIÓN: Restaurar scroll y añadir max-height --- */
  overflow-y: auto; /* Permite el scroll vertical si el contenido excede max-height */
  /* Establecemos una altura máxima. Calculamos el espacio restante restando
     la altura estimada del header (padding-top, título, botón) y el padding inferior.
     Ajusta el valor '240px' si el header ocupa más o menos espacio en tu layout final. */
  max-height: calc(100vh - 240px);
  /* --- FIN CORRECCIÓN --- */


  @media (max-width: 768px) {
    grid-template-columns: 1fr; // Asegura una sola columna
    gap: 15px;
    /* Ajustamos padding y quitamos max-width para que ocupe el ancho disponible menos el padding del container */
    padding: 10px 5px; // Menos padding horizontal dentro de la lista
    max-width: 100%; // Permitir que use el ancho completo del contenedor padre

    /* --- CORRECCIÓN: Ajustar max-height para móvil --- */
    /* Ajusta el valor '200px' si el header en móvil ocupa más o menos espacio. */
    max-height: calc(100vh - 200px);
     /* --- FIN CORRECCIÓN --- */
  }
`;

// ... (el resto de los styled components sin cambios: LevelCard, ActionButton, etc.)
export const LevelCard = styled.div`
  background-color: ${props => getActiveColor(props.$isInverted)}20;
  border: 2px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 10px;
  padding: 20px;
  color: ${props => getActiveColor(props.$isInverted)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px; // Añadimos una altura mínima para consistencia

  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    word-break: break-word;
  }

  p {
    font-size: 14px;
    margin-bottom: 15px;
    opacity: 0.8;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: auto; // Empuja los botones hacia abajo si hay espacio extra

    button {
      background-color: ${props => getActiveColor(props.$isInverted)};
      color: ${props => getInactiveColor(props.$isInverted)};
      border: none;
      border-radius: 5px;
      padding: 8px 12px;
      cursor: pointer;
      font-family: 'Excalifont';
      font-size: 14px;
      transition: opacity 0.2s;
      flex-grow: 1;
      text-align: center;

      &:hover {
        opacity: 0.8;
      }

       /* Ya no es necesario el media query específico para 400px si flex-grow funciona bien */
      /* @media (max-width: 400px) {
         min-width: 80px;
      } */
    }
  }

  @media (max-width: 768px) {
    padding: 15px; // Mantenemos padding reducido
    min-height: 150px; // Mantenemos altura mínima similar

    h3 {
      /* Aumentamos ligeramente el tamaño del título en móvil */
      font-size: 21px;
    }

    p {
      /* Aumentamos ligeramente el tamaño del párrafo en móvil */
      font-size: 14px;
    }

    .actions button {
      /* Aumentamos ligeramente el tamaño y padding de los botones en móvil */
      font-size: 14px;
      padding: 8px 10px; // Más cómodo para tocar
    }
  }
`;

export const ActionButton = styled.button`
  background-color: ${props => getActiveColor(props.$isInverted)};
  color: ${props => getInactiveColor(props.$isInverted)};
  border: none;
  border-radius: 10px;
  padding: 15px 25px;
  font-size: 20px;
  font-family: 'Excalifont';
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;

  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
    background-color: ${props => getActiveColor(props.$isInverted)};
    color: ${props => getInactiveColor(props.$isInverted)};
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 12px 20px;
  }
`;

export const ButtonContainer = styled.div`
  /* Reducimos el margen inferior inicial */
  margin-bottom: 25px;

  @media (max-width: 768px) {
    /* Reducimos más el margen inferior en móvil */
    margin-bottom: 15px;
  }
`;

export const NoLevelsMessage = styled.p`
  font-size: 24px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
  margin-top: 40px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-top: 30px;
  }
`;