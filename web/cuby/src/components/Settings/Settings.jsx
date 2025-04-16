import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SettingsContainer, 
  SettingsContent, 
  Title,
  Section,
  SectionTitle,
  VolumeSlider,
  ControlsSection,
  ControlsRow,
  ControlGroup,
  ControlLabel,
  KeyButton,
  SpacebarButton,
  JumpControlGroup,
  ErrorMessage,
  ResetButton
} from './Settings.styles';
import { useInversion } from '../../context/InversionContext';
import { useSettings } from '../../context/SettingsContext';
import BackArrow from '../common/BackArrow/BackArrow';

/**
 * Componente Settings - Pantalla de configuración del juego
 * 
 * Permite configurar:
 * - Volumen del juego
 * - Controles personalizables
 * - Inversión de colores (con tecla E)
 * 
 * @component
 */
const Settings = () => {
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  const { 
    volume, 
    changeVolume, 
    keyMapping, 
    changingControl, 
    startChangingControl,
    errorMessage,
    completedLevels,
    resetCompletedLevels 
  } = useSettings();

  // Estado para controlar si la tecla E ya fue procesada
  const [eKeyPressed, setEKeyPressed] = useState(false);
  // Estado para mostrar un mensaje de confirmación después de resetear niveles
  const [resetMessage, setResetMessage] = useState('');
  
  const handleBack = () => {
    navigate('/levels');
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
  };

  const handleKeyClick = (controlKey) => {
    startChangingControl(controlKey);
  };

  // Función para resetear el progreso de los niveles
  const handleResetProgress = () => {
    resetCompletedLevels();
    setResetMessage('Progreso de niveles reseteado. Ahora solo el nivel 1 está desbloqueado.');
    setTimeout(() => {
      setResetMessage('');
    }, 3000);
  };

  /**
   * Maneja la detección de la tecla E para invertir colores
   * No se activa cuando se está cambiando un control
   */
  const handleKeyDown = useCallback((e) => {
    // Solo procesamos la tecla E cuando no estamos cambiando un control
    if (e.key.toLowerCase() === 'e' && !changingControl && !eKeyPressed) {
      setEKeyPressed(true);
      toggleInversion();
    }
  }, [toggleInversion, changingControl, eKeyPressed]);

  const handleKeyUp = useCallback((e) => {
    if (e.key.toLowerCase() === 'e') {
      setEKeyPressed(false);
    }
  }, []);

  // Efecto para detectar la pulsación de la tecla E
  useEffect(() => {
    // No configuramos los event listeners si estamos cambiando un control
    if (!changingControl) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp, changingControl]);

  // Mapeo de las teclas a sus descripciones en pantalla
  const controlDescriptions = {
    jump: 'Saltar',
    jumpAlt: 'Saltar',
    left: 'Izquierda',
    right: 'Derecha',
    crouch: 'Agacharse',
    interact: 'Interactuar',
    invertColors: 'Invertir colores',
    restart: 'Reiniciar'
  };
  
  return (
    <SettingsContainer $isInverted={isInverted}>
      <BackArrow onClick={handleBack} />
      <SettingsContent>
        <Title $isInverted={isInverted}>Configuración</Title>
        
        {/* Sección de sonido */}
        <Section>
          <SectionTitle $isInverted={isInverted}>Sonido</SectionTitle>
          <VolumeSlider 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            $isInverted={isInverted}
          />
        </Section>
        
        {/* Sección de controles */}
        <Section>
          <SectionTitle $isInverted={isInverted}>Controles</SectionTitle>
          
          {/* Mostrar mensaje de error si existe */}
          {errorMessage && (
            <ErrorMessage $isInverted={isInverted}>
              {errorMessage}
            </ErrorMessage>
          )}
          
          <ControlsSection>
            {/* Primera fila: Saltar (W + Barra espaciadora), Invertir colores (E), Reiniciar (R) */}
            <ControlsRow>
              {/* Grupo de W y Barra espaciadora para saltar */}
              <JumpControlGroup $isInverted={isInverted}>
                <ControlLabel $isInverted={isInverted}>Saltar</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'jump'}
                  onClick={() => handleKeyClick('jump')}
                >
                  {keyMapping.jump.display}
                </KeyButton>
                <SpacebarButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'jumpAlt'}
                  onClick={() => handleKeyClick('jumpAlt')}
                >
                  Barra espaciadora
                </SpacebarButton>
              </JumpControlGroup>
              
              {/* Invertir colores (E) */}
              <ControlGroup>
                <ControlLabel $isInverted={isInverted}>Invertir colores</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'invertColors'}
                  onClick={() => toggleInversion()} // Cambiado para que al hacer clic invierta los colores
                >
                  {keyMapping.invertColors.display}
                </KeyButton>
              </ControlGroup>
              
              {/* Reiniciar (R) */}
              <ControlGroup>
                <ControlLabel $isInverted={isInverted}>Reiniciar</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'restart'}
                  onClick={() => handleKeyClick('restart')}
                >
                  {keyMapping.restart.display}
                </KeyButton>
              </ControlGroup>
            </ControlsRow>
            
            {/* Segunda fila: Izquierda (A), Agacharse (S), Derecha (D), Interactuar (F) */}
            <ControlsRow>
              {/* Izquierda (A) */}
              <ControlGroup>
                <ControlLabel $isInverted={isInverted}>Izquierda</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'left'}
                  onClick={() => handleKeyClick('left')}
                >
                  {keyMapping.left.display}
                </KeyButton>
              </ControlGroup>
              
              {/* Agacharse (S) */}
              <ControlGroup>
                <ControlLabel $isInverted={isInverted}>Agacharse</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'crouch'}
                  onClick={() => handleKeyClick('crouch')}
                >
                  {keyMapping.crouch.display}
                </KeyButton>
              </ControlGroup>
              
              {/* Derecha (D) */}
              <ControlGroup>
                <ControlLabel $isInverted={isInverted}>Derecha</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'right'}
                  onClick={() => handleKeyClick('right')}
                >
                  {keyMapping.right.display}
                </KeyButton>
              </ControlGroup>
              
              {/* Interactuar (F) */}
              <ControlGroup>
                <ControlLabel $isInverted={isInverted}>Interactuar</ControlLabel>
                <KeyButton 
                  $isInverted={isInverted} 
                  $isChanging={changingControl === 'interact'}
                  onClick={() => handleKeyClick('interact')}
                >
                  {keyMapping.interact.display}
                </KeyButton>
              </ControlGroup>
            </ControlsRow>
          </ControlsSection>
          
          {changingControl && !errorMessage && (
            <div style={{ textAlign: 'center', marginTop: '20px', color: isInverted ? 'black' : 'white' }}>
              Presiona una tecla para asignarla a "{controlDescriptions[changingControl]}" o ESC para cancelar
            </div>
          )}
        </Section>
        
        {/* Sección de progreso del juego */}
        <Section>
          <SectionTitle $isInverted={isInverted}>Progreso del Juego</SectionTitle>
          
          <div style={{ marginBottom: '15px', color: isInverted ? 'black' : 'white' }}>
            Niveles completados: {completedLevels.length === 1
              ? 'Nivel 1' 
              : completedLevels.filter(id => id !== 1).map(id => `Nivel ${id}`).join(', ')
            }
          </div>
          
          <ResetButton 
            onClick={handleResetProgress}
            $isInverted={isInverted}
          >
            Resetear Progreso de Niveles
          </ResetButton>
          
          {resetMessage && (
            <ErrorMessage $isInverted={isInverted} $success>
              {resetMessage}
            </ErrorMessage>
          )}
        </Section>
      </SettingsContent>
    </SettingsContainer>
  );
};

export default Settings;