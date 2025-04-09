import styled from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

export const SettingsContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => getInactiveColor(props.isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  position: relative;
`;

export const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  max-width: 600px;
`;

export const Title = styled.h1`
  font-size: 48px;
  margin-bottom: 40px;
  color: ${props => getActiveColor(props.isInverted)};
`;

export const Message = styled.div`
  font-size: 32px;
  color: ${props => getActiveColor(props.isInverted)};
  text-align: center;
  padding: 20px;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: ${props => getActiveColor(props.isInverted)};
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;