import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsButtonContainer } from './SettingsButton.styles';
import { useInversion } from '../../../context/InversionContext';
import { getActiveColor } from '../../../utils/colors';

/**
 * Componente SettingsButton - Botón de configuración con forma de engranaje
 * 
 * Componente común que renderiza un botón de configuración con animación de giro en hover.
 * Al hacer clic, navega a la pantalla de configuración.
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 */
const SettingsButton = () => {
  const navigate = useNavigate();
  const { isInverted } = useInversion();
  const gearColor = getActiveColor(isInverted);
  
  const handleClick = () => {
    navigate('/settings');
  };
  
  return (
    <SettingsButtonContainer onClick={handleClick} $isInverted={isInverted}>
      <svg width="32" height="32" viewBox="0 0 291.957 291.957" xmlns="http://www.w3.org/2000/svg" className="gear-icon">
        {/* Engranaje exterior */}
        <path 
          fill={gearColor}
          d="M283.07,168.875l-17.106-9.876c0.461-4.279,0.704-8.622,0.704-13.02s-0.243-8.742-0.704-13.021l17.106-9.876
          c3.655-2.11,6.27-5.519,7.363-9.598c1.092-4.078,0.531-8.338-1.58-11.994l-32.908-57.001c-2.816-4.878-8.067-7.907-13.705-7.907
          c-2.759,0-5.485,0.734-7.887,2.12l-17.155,9.905c-6.973-5.114-14.51-9.497-22.503-13.037V15.807C194.695,7.091,187.604,0,178.889,0
          h-65.82c-8.716,0-15.807,7.091-15.807,15.807V35.57c-7.993,3.54-15.531,7.924-22.503,13.038l-17.155-9.904
          c-2.401-1.387-5.128-2.121-7.887-2.121c-5.638,0-10.889,3.029-13.705,7.907L3.103,101.49c-2.111,3.655-2.672,7.916-1.58,11.994
          c1.094,4.079,3.708,7.487,7.363,9.598l17.106,9.876c-0.461,4.279-0.704,8.622-0.704,13.021s0.243,8.742,0.704,13.02l-17.106,9.876
          c-3.655,2.11-6.269,5.518-7.363,9.598c-1.092,4.078-0.531,8.339,1.58,11.994l32.908,57.001c2.816,4.878,8.067,7.907,13.705,7.907
          c2.759,0,5.485-0.733,7.887-2.12l17.155-9.905c6.973,5.114,14.51,9.497,22.503,13.037v19.764c0,4.222,1.644,8.19,4.631,11.176
          c2.985,2.985,6.955,4.63,11.176,4.63h65.82c8.715,0,15.807-7.09,15.807-15.806v-19.764c7.992-3.541,15.53-7.923,22.502-13.037
          l17.156,9.904c2.401,1.387,5.128,2.12,7.887,2.12c5.638,0,10.889-3.029,13.705-7.907l32.908-57.001
          c2.111-3.655,2.672-7.916,1.58-11.994C289.34,174.393,286.726,170.985,283.07,168.875z M145.979,201.668
      
            M105.979,95.979
            H185.979
            A10,10 0 0 1 195.979,105.979
            V185.979
            A10,10 0 0 1 185.979,195.979
            H105.979
            A10,10 0 0 1 95.979,185.979
            V105.979
            A10,10 0 0 1 105.979,95.979
            Z
        "
        />
      </svg>
      <span>AJUSTES</span>
    </SettingsButtonContainer>
  );
};

export default SettingsButton;