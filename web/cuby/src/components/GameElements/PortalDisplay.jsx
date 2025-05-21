import React from 'react';
import { Portal as StyledPortal } from './GameElements.styles'; // Rectángulo animado
import { getActiveColor } from '../../utils/colors';
import { Portal } from './GameElements'; // Para defaults

// Componente funcional para el Rectángulo Animado (Entrada Activa / Salida Inactiva)
const AnimatedRectangle = ({ x, y, width, height, elementColor, $isInverted, portalId, style, $showSilhouette }) => {
  const isActive = elementColor === getActiveColor($isInverted);
  const textColor = getActiveColor($isInverted);

  return (
    <StyledPortal
      x={x}
      y={y}
      width={width}
      height={height}
      color={elementColor} // Color lógico ('white' o 'black') para que StyledPortal decida
      $isInverted={$isInverted}
      style={style}
      $showSilhouette={$showSilhouette}
    >
      {portalId !== undefined && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', color: isActive ? textColor : '#888', // Atenuar si inactivo
          fontSize: `${Math.min(width, height) * 0.35}px`, fontWeight: 'bold',
          zIndex: 1, pointerEvents: 'none', opacity: isActive ? 1 : 0.7,
        }}>
          {portalId}
        </div>
      )}
    </StyledPortal>
  );
};

// Componente funcional para el Diamante (Salida Activa / Entrada Inactiva)
const DiamondMarker = ({ x, y, width, height, elementColor, $isInverted, portalId, style, $showSilhouette }) => {
  const isActive = elementColor === getActiveColor($isInverted);
  const displayColor = isActive ? getActiveColor($isInverted) : 'transparent';
  const borderColor = isActive ? 'none' : `2px dashed ${getActiveColor($isInverted)}50`;
  const textColor = getActiveColor($isInverted);

  return (
    <div style={{
      position: 'absolute', left: x, top: y, width, height,
      pointerEvents: 'none', ...style
    }}>
      <div style={{
        width: '100%', height: '100%',
        backgroundColor: displayColor,
        border: borderColor,
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        opacity: isActive ? 0.8 : 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {portalId !== undefined && (
          <span style={{
            color: isActive ? textColor : '#888', // Atenuar si inactivo
            fontSize: `${Math.min(width, height) * 0.3}px`, // Un poco más pequeño para el diamante
            fontWeight: 'bold',
            opacity: isActive ? 1 : 0.7,
          }}>
            {portalId}
          </span>
        )}
      </div>
    </div>
  );
};

const PortalDisplay = ({ 
  x, y, 
  width = Portal.defaultWidth, 
  height = Portal.defaultHeight, 
  color, // Este es el color lógico del portal ('white' o 'black')
  destination, 
  portalId, 
  $isInverted,
  style,
  $showSilhouette
}) => {

  const diamondScaleFactor = 0.4; // Factor de escala para el diamante

  // Determina si el portal base (en x,y) está "activo" según el color del juego
  const isBaseActive = color === getActiveColor($isInverted);

  // Props comunes para ambos elementos
  const commonProps = {
    elementColor: color,
    $isInverted,
    portalId
  };

  // Props para el rectángulo (tamaño completo)
  const rectangleProps = {
    ...commonProps,
    width,
    height,
  };

  // Props para el diamante (tamaño escalado)
  const diamondProps = {
    ...commonProps,
    width: width * diamondScaleFactor,
    height: height * diamondScaleFactor,
  };
  
  // Props para el destino del diamante (tamaño escalado respecto al tamaño original del portal)
  // O si el destino tiene sus propias dimensiones, se escalan esas.
  const diamondDestProps = {
    ...commonProps,
    width: (destination?.width || width) * diamondScaleFactor,
    height: (destination?.height || height) * diamondScaleFactor,
  };

  // Props para el destino del rectángulo (tamaño completo)
  const rectangleDestProps = {
    ...commonProps,
    width: destination?.width || width,
    height: destination?.height || height,
  };

  return (
    <>
      {isBaseActive ? (
        // Portal activo: Entrada es Rectángulo, Salida es Diamante
        <>
          <AnimatedRectangle x={x} y={y} {...rectangleProps} style={style} $showSilhouette={$showSilhouette} />
          {destination && <DiamondMarker x={destination.x} y={destination.y} {...diamondDestProps} style={style} $showSilhouette={$showSilhouette} />}
        </>
      ) : (
        // Portal inactivo: Entrada es Diamante, Salida es Rectángulo
        <>
          <DiamondMarker x={x} y={y} {...diamondProps} style={style} $showSilhouette={$showSilhouette} />
          {destination && <AnimatedRectangle x={destination.x} y={destination.y} {...rectangleDestProps} style={style} $showSilhouette={$showSilhouette} />}
        </>
      )}
    </>
  );
};

export default PortalDisplay;