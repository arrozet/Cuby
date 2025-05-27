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
  /* Reducimos más el padding superior */
  padding: 40px 20px 0; // Eliminamos el padding inferior
  position: relative;
  box-sizing: border-box;

  @media (max-width: 768px) {
    /* Reducimos más el padding superior en móvil */
    padding-top: 35px; // Antes era 50px
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1000px; // Para mantener la consistencia con LevelsList
  margin-bottom: 15px;

  @media (max-width: 1000px) {
    flex-direction: row;
    justify-content: center;
    gap: 20px;
    align-items: center;
    padding: 0 20px; // Añadimos padding lateral para que no se pegue a los bordes
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    margin-bottom: 10px;
    padding: 0 10px; // Ajustamos el padding para pantallas más pequeñas
  }
`;

export const Title = styled.h1`
  font-size: 40px; // Ligeramente más pequeño
  /* Reducimos significativamente el margen inferior */
  margin-bottom: 15px; // Antes era 30px
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;

  @media (max-width: 1000px) {
    margin-bottom: 0; // Eliminamos el margen inferior cuando está en fila
    text-align: left; // Alineamos a la izquierda
  }

  @media (max-width: 768px) {
    font-size: 28px; // Ligeramente más pequeño en móvil
    /* Reducimos más el margen inferior en móvil */
    margin-bottom: 10px; // Antes era 20px
  }
`;

export const LevelsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;
  flex-grow: 1;
  min-height: 0;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 10px 5px;
    max-width: 100%;
  }
`;

export const LevelCard = styled.div`
  background-color: ${props => getActiveColor(props.$isInverted)}20;
  border: 2px solid ${props => getActiveColor(props.$isInverted)};
  border-radius: 10px;
  padding: 20px;
  color: ${props => getActiveColor(props.$isInverted)};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;

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
    margin-top: auto;

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
    }
  }

  @media (max-width: 768px) {
    padding: 15px;
    min-height: 150px;

    h3 {
      font-size: 21px;
    }

    p {
      font-size: 14px;
    }

    .actions button {
      font-size: 14px;
      padding: 8px 10px;
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
  /* Reducimos significativamente el margen inferior */
  margin-bottom: 15px; // Antes era 25px

  @media (max-width: 1000px) {
    margin-bottom: 0; // Eliminamos el margen inferior cuando está en fila
  }

  @media (max-width: 768px) {
    /* Reducimos más el margen inferior en móvil */
    margin-bottom: 10px; // Antes era 15px
  }
`;

export const NoLevelsMessage = styled.p`
  font-size: 24px;
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
  margin-top: 40px; // Mantenemos un margen superior razonable para el mensaje

  @media (max-width: 768px) {
    font-size: 18px;
    margin-top: 30px;
  }
`;