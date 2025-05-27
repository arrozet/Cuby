import React, { useEffect, useState } from 'react';
import { LevelContentWrapper } from './LevelEditor.styles';
import PlatformDisplay from '../GameElements/PlatformDisplay';
import SpikeDisplay from '../GameElements/SpikeDisplay';
import TrampolineDisplay from '../GameElements/TrampolineDisplay';
import PortalDisplay from '../GameElements/PortalDisplay';
import GoalDisplay from '../GameElements/GoalDisplay';
import PlayerStartDisplay from '../GameElements/PlayerStartDisplay';
import { getActiveColor, getInactiveColor } from '../../utils/colors'; // Para el mensaje de destino de portal

// Clases de datos para acceder a los defaultWidth/Height
import { Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';

// Dimensiones lógicas del nivel. Considera pasarlas como props si pueden variar.
const LOGICAL_LEVEL_WIDTH = 1200;
const LOGICAL_LEVEL_HEIGHT = 800;

/**
 * Componente dedicado a renderizar el contenido visual del nivel dentro del editor.
 * Muestra todos los elementos del juego (plataformas, obstáculos, etc.),
 * el portal pendiente (si existe) y el elemento de previsualización.
 *
 * @param {object} props - Propiedades del componente.
 * @param {React.RefObject<HTMLElement>} props.contentWrapperRef - Referencia al div que envuelve el contenido del nivel.
 * @param {object} props.level - El objeto de nivel con todos sus elementos.
 * @param {boolean} props.isInverted - Estado de inversión de colores.
 * @param {object | null} props.pendingPortal - El portal que está esperando la selección de su destino.
 * @param {boolean} props.isSelectingPortalDestination - Indica si se está en modo de seleccionar destino de portal.
 * @param {object | null} props.previewElement - El elemento que se muestra como previsualización al mover el ratón.
 * @param {number} props.portalCounter - Contador actual de portales (usado para el mensaje de ayuda).
 * @returns {JSX.Element} El JSX para renderizar el contenido del canvas.
 */
const CanvasRenderer = React.forwardRef(({
    level,
    isInverted,
    pendingPortal,
    isSelectingPortalDestination,
    previewElement,
    portalCounter,
    // Las refs como canvasRef se pasan a EditorCanvas, no directamente aquí normalmente.
    // contentWrapperRef sí es necesario para aplicar las dimensiones lógicas.
}, ref) => {
    // Estado para almacenar el factor de escala calculado
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    // Efecto para calcular el escalado óptimo basado en el tamaño de la ventana
    useEffect(() => {
        // Función para calcular el escalado del nivel
        const calculateScale = () => {
            if (ref && ref.current && ref.current.parentElement) {
                // Obtenemos el tamaño del contenedor padre (EditorCanvas)
                const containerWidth = ref.current.parentElement.clientWidth;
                const containerHeight = ref.current.parentElement.clientHeight;
                
                // Calculamos el factor de escala para que el nivel encaje correctamente
                // Usando el mínimo entre la proporción horizontal y vertical
                const scaleX = containerWidth / LOGICAL_LEVEL_WIDTH;
                const scaleY = containerHeight / LOGICAL_LEVEL_HEIGHT;
                const calculatedScale = Math.min(scaleX, scaleY);
                
                // Para dispositivos móviles, aseguramos un mínimo de visibilidad
                const minScale = 0.2; // Mínimo 20% del tamaño original
                const finalScale = Math.max(calculatedScale, minScale);
                
                // Calculamos la posición centrada
                const xPos = (containerWidth - (LOGICAL_LEVEL_WIDTH * finalScale)) / 2;
                const yPos = (containerHeight - (LOGICAL_LEVEL_HEIGHT * finalScale)) / 2;
                
                setScale(finalScale);
                setPosition({ x: xPos, y: yPos });
            }
        };
        
        // Calculamos el escala inicial
        calculateScale();
        
        // Recalculamos cuando cambie el tamaño de la ventana
        const handleResize = () => {
            calculateScale();
        };
        
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [ref]); // Dependencia: contentWrapperRef (pasado como ref)

    if (!level) {
        // Podrías mostrar un loader más específico o nada si el LevelEditor ya muestra uno.
        return null;
    }

    return (
        <>
            <LevelContentWrapper
                ref={ref} // Asigna la ref (contentWrapperRef) al div principal
                $logicalWidth={LOGICAL_LEVEL_WIDTH}
                $logicalHeight={LOGICAL_LEVEL_HEIGHT}
                $isInverted={isInverted}
                style={{
                    // Aplicamos la transformación calculada dinámicamente
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                    transformOrigin: 'top left',
                }}
            >
                {/* Renderiza todas las plataformas del nivel */}
                {level.platforms.map((platform, index) => (
                    <PlatformDisplay
                        key={`platform-${index}`}
                        {...platform}
                        $isInverted={isInverted}
                    />
                ))}

                {/* Renderiza todos los obstáculos (pinchos) del nivel */}
                {level.obstacles.map((obstacle, index) => (
                    <SpikeDisplay
                        key={`obstacle-${index}`}
                        {...obstacle}
                        width={obstacle.width || Spike.defaultWidth}
                        height={obstacle.height || Spike.defaultHeight}
                        $isInverted={isInverted}
                    />
                ))}

                {/* Renderiza todos los trampolines del nivel */}
                {level.trampolines.map((trampoline, index) => (
                    <TrampolineDisplay
                        key={`trampoline-${index}`}
                        {...trampoline}
                        width={trampoline.width || Trampoline.defaultWidth}
                        height={trampoline.height || Trampoline.defaultHeight}
                        $isInverted={isInverted}
                    />
                ))}

                {/* Renderiza todos los portales del nivel */}
                {level.portals.map((portal, index) => (
                    <PortalDisplay
                        key={`portal-${index}`}
                        {...portal}
                        width={portal.width || Portal.defaultWidth}
                        height={portal.height || Portal.defaultHeight}
                        $isInverted={isInverted}
                    />
                ))}

                {/* Renderiza la meta si existe */}
                {level.goal && (
                    <GoalDisplay
                        {...level.goal}
                        width={level.goal.width || Goal.defaultWidth}
                        height={level.goal.height || Goal.defaultHeight}
                        $isInverted={isInverted}
                    />
                )}

                {/* Renderiza el punto de inicio del jugador si existe */}
                {level.playerStart && (
                    <PlayerStartDisplay
                        {...level.playerStart}
                        $isInverted={isInverted}
                    />
                )}

                {/* Renderiza el portal pendiente si se está colocando uno (antes de definir el destino) */}
                {pendingPortal && isSelectingPortalDestination && (
                    <PortalDisplay
                        x={pendingPortal.x}
                        y={pendingPortal.y}
                        width={pendingPortal.width || Portal.defaultWidth}
                        height={pendingPortal.height || Portal.defaultHeight}
                        portalId={pendingPortal.portalId}
                        $isInverted={isInverted}
                    />
                )}

                {/* Renderiza el elemento de previsualización */}
                {previewElement && (
                    <div style={{
                        position: 'absolute',
                        left: '0px', // Estas posiciones relativas al LevelContentWrapper
                        top: '0px',
                        opacity: 0.5,
                        pointerEvents: 'none',
                        width: '100%', // Cubre todo el LevelContentWrapper para posicionar dentro
                        height: '100%',
                    }}>
                        {previewElement.type === 'platform' &&
                            <PlatformDisplay {...previewElement} $isInverted={isInverted} />
                        }
                        {previewElement.type === 'spike' &&
                            <SpikeDisplay {...previewElement} $isInverted={isInverted} />
                        }
                        {previewElement.type === 'trampoline' &&
                            <TrampolineDisplay {...previewElement} $isInverted={isInverted} />
                        }
                        {previewElement.type === 'portal' &&
                            <PortalDisplay
                                x={previewElement.x}
                                y={previewElement.y}
                                width={previewElement.width}
                                height={previewElement.height}
                                portalId={previewElement.portalId}
                                $isInverted={isInverted}
                            />
                        }
                        {previewElement.type === 'goal' &&
                            <GoalDisplay {...previewElement} $isInverted={isInverted} />
                        }
                        {previewElement.type === 'player-start' &&
                            <PlayerStartDisplay {...previewElement} $isInverted={isInverted} />
                        }
                    </div>
                )}

                {/* Renderiza siluetas de los elementos del color de fondo (solo en el editor) */}
                {level.platforms.map((platform, index) => (
                    platform.color !== getActiveColor(isInverted) && (
                        <PlatformDisplay
                            key={`platform-silhouette-${index}`}
                            {...platform}
                            $isInverted={isInverted}
                            style={{ opacity: 0.25, pointerEvents: 'none' }}
                            $showSilhouette={true}
                        />
                    )
                ))}
                {level.obstacles.map((obstacle, index) => (
                    obstacle.color !== getActiveColor(isInverted) && (
                        <SpikeDisplay
                            key={`obstacle-silhouette-${index}`}
                            {...obstacle}
                            width={obstacle.width || Spike.defaultWidth}
                            height={obstacle.height || Spike.defaultHeight}
                            $isInverted={isInverted}
                            style={{ opacity: 0.25, pointerEvents: 'none' }}
                            $showSilhouette={true}
                        />
                    )
                ))}
                {level.trampolines.map((trampoline, index) => (
                    trampoline.color !== getActiveColor(isInverted) && (
                        <TrampolineDisplay
                            key={`trampoline-silhouette-${index}`}
                            {...trampoline}
                            width={trampoline.width || Trampoline.defaultWidth}
                            height={trampoline.height || Trampoline.defaultHeight}
                            $isInverted={isInverted}
                            style={{ opacity: 0.25, pointerEvents: 'none' }}
                            $showSilhouette={true}
                        />
                    )
                ))}
                {level.portals.map((portal, index) => (
                    portal.color !== getActiveColor(isInverted) && (
                        <PortalDisplay
                            key={`portal-silhouette-${index}`}
                            {...portal}
                            width={portal.width || Portal.defaultWidth}
                            height={portal.height || Portal.defaultHeight}
                            $isInverted={isInverted}
                            style={{ opacity: 0.25, pointerEvents: 'none' }}
                            $showSilhouette={true}
                        />
                    )
                ))}
            </LevelContentWrapper>

            {/* Mensaje de ayuda al usuario cuando está seleccionando el destino de un portal */}
            {isSelectingPortalDestination && (
                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: getActiveColor(isInverted),
                        color: getInactiveColor(isInverted),
                        padding: '8px 15px',
                        borderRadius: '5px',
                        textAlign: 'center',
                        zIndex: 50, // Asegura que esté visible sobre otros elementos del canvas
                        opacity: 0.9,
                        fontSize: '14px',
                        pointerEvents: 'none' // Para que no interfiera con los clics en el canvas
                    }}
                >
                    Haz clic para establecer el destino del portal {pendingPortal?.portalId !== undefined ? pendingPortal.portalId : portalCounter -1 }, o clic derecho / Esc para cancelar.
                </div>
            )}
        </>
    );
});

CanvasRenderer.displayName = 'CanvasRenderer'; // Ayuda en la depuración con React DevTools

export default CanvasRenderer; 