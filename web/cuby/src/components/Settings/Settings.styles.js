// Settings.styles.js
import styled, { keyframes } from 'styled-components';
import { getInactiveColor, getActiveColor } from '../../utils/colors';

// Contenedor principal
export const SettingsContainer = styled.div`
  width: 100vw;
  min-height: 100vh; // Usar min-height para permitir scroll si el contenido es largo
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${props => getInactiveColor(props.$isInverted)};
  font-family: 'Excalifont';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transition: background-color 0.3s ease;
  position: relative;
  /* Padding superior/inferior responsivo, laterales fijos/responsivos */
  padding: clamp(50px, 8vh, 80px) 20px clamp(30px, 5vh, 50px) 20px;
  overflow-y: auto; // Permite scroll vertical si el contenido excede la altura
  box-sizing: border-box; // Incluir padding en el tamaño total
`;

// Contenedor del contenido central
export const SettingsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center; // Centra las secciones
  width: 100%;
  max-width: 900px; // Límite para pantallas grandes
  padding: 0 clamp(10px, 3vw, 20px); // Padding horizontal responsivo dentro del contenido
  box-sizing: border-box;
`;

// Título principal
export const Title = styled.h1`
  font-size: clamp(2.2rem, 7vw, 3rem); // Tamaño responsivo
  margin-bottom: clamp(25px, 6vh, 40px); // Margen responsivo
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
`;

// Divisor de sección
export const Section = styled.div`
  width: 100%; // Ocupa el ancho del SettingsContent
  margin-bottom: clamp(30px, 6vh, 45px); // Espaciado responsivo entre secciones
  display: flex; // Usar flex para centrar contenido como el slider o botones
  flex-direction: column;
  align-items: center; // Centrar elementos dentro de la sección
`;

// Título de sección
export const SectionTitle = styled.h2`
  font-size: clamp(1.5rem, 5vw, 2rem); // Tamaño responsivo
  margin-bottom: clamp(15px, 3vh, 25px); // Margen responsivo
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
`;

// Slider de volumen
export const VolumeSlider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  max-width: 400px; // Evita que sea demasiado ancho
  margin: 0 auto; // Centrado horizontalmente
  display: block; // Para que margin: auto funcione
  height: 12px;
  border-radius: 8px;
  background: ${props => getActiveColor(props.$isInverted)}50; // Fondo semi-transparente
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }

  // Estilo del "pulgar" (handle) del slider para Webkit (Chrome, Safari)
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px; // Tamaño del pulgar
    height: 25px;
    border-radius: 50%; // Forma circular
    background: ${props => getActiveColor(props.$isInverted)}; // Color principal
    border: 2px solid ${props => getInactiveColor(props.$isInverted)}; // Borde con color de fondo
    cursor: pointer;
  }

  // Estilo del "pulgar" para Firefox
  &::-moz-range-thumb {
    width: 22px; // Ligeramente más pequeño para consistencia visual
    height: 22px;
    border-radius: 50%;
    background: ${props => getActiveColor(props.$isInverted)};
    border: 2px solid ${props => getInactiveColor(props.$isInverted)};
    cursor: pointer;
  }
`;

// Contenedor de la sección de controles
export const ControlsSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; // Centra las filas de controles
  gap: clamp(20px, 4vh, 30px); // Espacio responsivo entre filas
`;

// Fila de controles
export const ControlsRow = styled.div`
  display: flex;
  justify-content: center; // Centra los grupos de control en la fila
  flex-wrap: wrap; // ¡IMPORTANTE! Permite que los grupos pasen a la siguiente línea en pantallas pequeñas
  gap: clamp(15px, 3vw, 35px); // Espacio responsivo entre grupos de controles (un poco más grande)
  width: 100%; // Ocupa el ancho disponible
`;

// Grupo individual de control (Label + Botón)
export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: clamp(80px, 20vw, 95px); // Ancho mínimo responsivo
`;

// Etiqueta del control (ej: "Saltar")
export const ControlLabel = styled.div`
  font-size: clamp(1rem, 3vw, 1.2rem); // Tamaño responsivo
  margin-bottom: 10px; // Espacio aumentado ligeramente
  color: ${props => getActiveColor(props.$isInverted)};
  text-align: center;
  white-space: nowrap; // Evita que el texto se parta (generalmente son cortos)
`;

// Animación de parpadeo para el botón que se está cambiando
const blink = keyframes`
  0%, 100% { border-color: ${props => getActiveColor(props.$isInverted)}; opacity: 1; }
  50% { border-color: red; opacity: 0.5; } // Parpadea a rojo para más énfasis
`;

// Botón de tecla (cuadrado)
export const KeyButton = styled.div`
  /* Usar aspect-ratio para mantenerlo cuadrado si es posible, o width/height iguales */
  width: clamp(55px, 14vw, 75px); // Tamaño responsivo
  height: clamp(55px, 14vw, 75px); // Tamaño responsivo
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: clamp(1rem, 4vw, 1.4rem); // Fuente responsiva
  border: 3px solid ${props => (props.$isChanging ? 'red' : getActiveColor(props.$isInverted))}; // Borde rojo si cambia
  border-radius: 10px;
  color: ${props => getActiveColor(props.$isInverted)};
  background-color: ${props => getActiveColor(props.$isInverted)}1A; // Fondo muy sutil
  user-select: none;
  cursor: pointer;
  padding: 5px;
  text-align: center;
  word-break: break-word; // Permite romper palabras largas (aunque raro para teclas)
  transition: background-color 0.2s, transform 0.1s, border-color 0.3s, color 0.3s;
  /* Aplicar animación de parpadeo si $isChanging es true */
  animation: ${props => props.$isChanging ? blink : 'none'} 1s ease-in-out infinite;

  &:hover {
    background-color: ${props => getActiveColor(props.$isInverted)}33; // Más opaco al pasar el ratón
  }
   &:active {
     transform: scale(0.95); // Efecto de clic
   }
`;

// Botón para la barra espaciadora (más ancho)
export const SpacebarButton = styled(KeyButton)`
  width: clamp(180px, 50vw, 280px); // Ancho responsivo y más grande
  font-size: clamp(0.9rem, 3.5vw, 1.3rem); // Fuente ligeramente más pequeña para caber
`;

// Grupo especial para Salto (W + Espacio)
export const JumpControlGroup = styled.div`
  display: flex;
  flex-direction: column; // Apilado verticalmente por defecto (móvil)
  align-items: center;
  gap: clamp(10px, 2vh, 15px); // Espacio interno responsivo
  border: 2px solid ${props => getActiveColor(props.$isInverted)}80; // Borde más sutil
  border-radius: 15px;
  padding: clamp(12px, 2vh, 18px); // Padding interno responsivo
  background-color: ${props => getActiveColor(props.$isInverted)}0D; // Fondo muy muy sutil

  /* En pantallas más anchas (ej: > 450px), poner los botones de salto uno al lado del otro */
   @media (min-width: 480px) { // Ajustado breakpoint
     flex-direction: row; // Lado a lado
     align-items: center; // Alinear verticalmente los botones y la etiqueta (si se moviese)
     gap: clamp(15px, 3vw, 20px); // Ajustar gap para disposición horizontal
   }

   /* La etiqueta "Saltar" debe estar centrada arriba en móvil y a la izquierda/arriba en escritorio */
   ${ControlLabel} {
      width: 100%; // Ocupa todo el ancho en móvil para centrarse bien
      margin-bottom: 10px; // Espacio debajo de la etiqueta en móvil

      @media (min-width: 480px) {
          width: auto; // Ancho automático en escritorio
          margin-bottom: 0; // Sin margen inferior
          margin-right: 15px; // Espacio a la derecha de la etiqueta
     }
   }
`;

// Mensaje de error o éxito
export const ErrorMessage = styled.div`
  background-color: ${props => props.$isInverted ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.$success
    ? (props.$isInverted ? '#57cc5c' : '#4caf50') // Verde éxito (tonos ajustados)
    : (props.$isInverted ? '#ff7070' : '#ff5252')}; // Rojo error (tonos ajustados)
  border: 1px solid ${props => props.$success
    ? (props.$isInverted ? '#57cc5c' : '#4caf50')
    : (props.$isInverted ? '#ff7070' : '#ff5252')};
  border-radius: 8px;
  padding: clamp(10px, 1.5vh, 12px) clamp(15px, 3vw, 20px); // Padding responsivo
  margin: 15px auto; // Centrado horizontalmente, con margen vertical
  width: fit-content; // Ajustar al contenido
  max-width: 90%; // Evitar desbordamiento
  text-align: center;
  font-size: clamp(0.9rem, 2.5vw, 1rem); // Fuente responsiva (ligeramente más pequeña)
  font-weight: bold;
  /* Animación sutil de aparición */
  animation: ${keyframes`
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  `} 0.3s ease-out;
`;

// Botón de resetear progreso
export const ResetButton = styled.button`
  background-color: ${props => props.$isInverted ? '#ff6666' : '#ff3333'}; // Rojo base
  color: white;
  border: none;
  border-radius: 8px;
  padding: clamp(10px, 1.8vh, 14px) clamp(18px, 4vw, 25px); // Padding responsivo
  font-size: clamp(1rem, 3vw, 1.1rem); // Fuente responsiva
  font-family: 'Excalifont';
  cursor: pointer;
  transition: all 0.2s ease; // Transición suave
  display: block;
  margin: 15px auto 0 auto; // Centrado

  &:hover {
    background-color: ${props => props.$isInverted ? '#ff4d4d' : '#e53935'}; // Rojo más oscuro al pasar
    transform: translateY(-2px); // Ligero levantamiento
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); // Sombra sutil
  }

  &:active {
    transform: translateY(0px) scale(0.98); // Efecto de clic
    box-shadow: none;
  }
`;

// Texto informativo general (como "Niveles completados:")
export const InfoText = styled.div`
   margin-bottom: 15px;
   color: ${props => getActiveColor(props.$isInverted)};
   font-size: clamp(0.9rem, 2.5vw, 1.1rem); // Fuente responsiva
   text-align: center; // Centrado
   line-height: 1.5; // Espaciado de línea para legibilidad
`;

// Mensaje "Presiona una tecla..."
export const ChangeKeyPrompt = styled(InfoText)`
   margin-top: 25px; // Más espacio arriba
   font-weight: bold;
   color: ${props => props.$isInverted ? '#e0e0e0' : '#333'}; // Color ligeramente diferente para destacar
`;

// No necesitas redefinir BackButton aquí si ya existe en common/BackArrow/BackArrow.styles.js
// Si no, mantenlo como estaba.
/*
export const BackButton = styled.button`
  position: absolute;
  top: clamp(15px, 3vh, 25px); // Posición superior responsiva
  left: clamp(15px, 3vw, 25px); // Posición izquierda responsiva
  background: none;
  border: none;
  font-size: clamp(1.5rem, 5vw, 2rem); // Tamaño del icono responsivo
  color: ${props => getActiveColor(props.$isInverted)};
  cursor: pointer;
  padding: 5px; // Área de clic aumentada
  z-index: 10; // Asegurar que esté encima de otros elementos

  &:hover {
    opacity: 0.7;
  }
`;
*/