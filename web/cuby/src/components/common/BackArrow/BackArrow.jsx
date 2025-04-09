import React from 'react';
import { BackArrowContainer } from './BackArrow.styles';
import { useInversion } from '../../../context/InversionContext';
import { getActiveColor } from '../../../utils/colors';

/**
 * Componente BackArrow - Flecha para volver atrás
 * 
 * Componente común que renderiza una flecha para navegar a la vista anterior.
 * Se utiliza en la pantalla de selección de niveles y dentro de los niveles.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClick - Función a ejecutar cuando se hace clic en la flecha
 */
const BackArrow = ({ onClick }) => {
  const { isInverted } = useInversion();
  const arrowColor = getActiveColor(isInverted);
  
  return (
    <BackArrowContainer onClick={onClick} isInverted={isInverted}>
      <svg width="24" height="8" viewBox="0 0 16 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
        <path d="M1 4H12V1" stroke={arrowColor}/>
        <path d="M1.5 4H12.5H16" stroke={arrowColor}/>
        <path d="M0.146447 4.35355C-0.0488155 4.15829 -0.0488155 3.84171 0.146447 3.64645L3.32843 0.464466C3.52369 0.269204 3.84027 0.269204 4.03553 0.464466C4.2308 0.659728 4.2308 0.976311 4.03553 1.17157L1.20711 4L4.03553 6.82843C4.2308 7.02369 4.2308 7.34027 4.03553 7.53553C3.84027 7.7308 3.52369 7.7308 3.32843 7.53553L0.146447 4.35355ZM1 4.5H0.5V3.5H1V4.5Z" fill={arrowColor}/>
      </svg>
    </BackArrowContainer>
  );
};

export default BackArrow;