import { useCallback } from 'react';
import { getActiveColor } from '../../../utils/colors';
import { Platform, Spike, Trampoline, Portal, Goal } from '../../GameElements/GameElements';

// Constantes para las dimensiones lógicas del nivel, si son necesarias aquí
// o pasarlas como parámetros si pueden variar.
const LOGICAL_LEVEL_WIDTH = 1200;
const LOGICAL_LEVEL_HEIGHT = 800;

/**
 * Hook personalizado para manejar todas las interacciones del usuario con el canvas del editor de niveles.
 * Incluye la colocación y eliminación de elementos, la gestión de la previsualización,
 * y el manejo de clics y movimientos del ratón/puntero.
 *
 * @param {object} params - Parámetros de configuración del hook.
 * @param {React.RefObject<HTMLElement>} params.canvasRef - Referencia al elemento del canvas.
 * @param {React.RefObject<HTMLElement>} params.contentWrapperRef - Referencia al contenedor del contenido del nivel.
 * @param {object} params.level - El estado actual del nivel.
 * @param {function} params.setLevel - Función para actualizar el estado del nivel.
 * @param {function} params.setHasUnsavedChanges - Función para indicar que hay cambios sin guardar.
 * @param {string} params.editorMode - Modo actual del editor ('place', 'erase').
 * @param {string | null} params.selectedElement - El tipo de elemento seleccionado para colocar.
 * @param {boolean} params.isInverted - Estado de inversión de colores.
 * @param {object} params.platformSize - Tamaño de la plataforma seleccionada.
 * @param {boolean} params.isSelectingPortalDestination - Estado de selección del destino del portal.
 * @param {function} params.setIsSelectingPortalDestination - Función para actualizar el estado de selección del destino del portal.
 * @param {object | null} params.pendingPortal - Información del portal cuya entrada ha sido colocada y espera destino.
 * @param {function} params.setPendingPortal - Función para actualizar el portal pendiente.
 * @param {number} params.portalCounter - Contador para los IDs de los portales.
 * @param {function} params.setPortalCounter - Función para actualizar el contador de portales.
 * @param {object | null} params.previewElement - Elemento que se muestra como previsualización.
 * @param {function} params.setPreviewElement - Función para actualizar el elemento de previsualización.
 * @returns {object} - Objeto con los manejadores de eventos para el canvas.
 */
export const useCanvasInteraction = ({
    canvasRef, // Añadido para que getLogicalCoords funcione
    contentWrapperRef,
    level,
    setLevel,
    setHasUnsavedChanges,
    editorMode,
    selectedElement,
    isInverted,
    platformSize,
    isSelectingPortalDestination,
    setIsSelectingPortalDestination,
    pendingPortal,
    setPendingPortal,
    portalCounter,
    setPortalCounter,
    previewElement, // Necesario para eraseElementAt y handleCanvasMouseMoveForPreview
    setPreviewElement,
}) => {

    // Calcula las coordenadas lógicas dentro del nivel a partir de las coordenadas del cliente (ratón/táctil).
    const getLogicalCoords = useCallback((clientX, clientY) => {
        // Asegura que las referencias al canvas y al wrapper de contenido existan.
        if (!contentWrapperRef.current || !canvasRef.current) return { x: 0, y: 0 };

        const canvasRect = canvasRef.current.getBoundingClientRect();
        const contentRect = contentWrapperRef.current.getBoundingClientRect();
        
        // Obtiene el factor de escala actual del contenedor de contenido
        const currentTransform = window.getComputedStyle(contentWrapperRef.current).transform;
        const matrix = new DOMMatrixReadOnly(currentTransform);
        const scaleX = matrix.a;
        
        // Calcula las coordenadas relativas al canvas
        const mouseXCanvas = clientX - canvasRect.left;
        const mouseYCanvas = clientY - canvasRect.top;
        
        // Calcula las coordenadas relativas al contenido lógico teniendo en cuenta la posición
        // del contenedor de contenido dentro del canvas y el factor de escala
        const contentOffsetX = contentRect.left - canvasRect.left;
        const contentOffsetY = contentRect.top - canvasRect.top;
        
        // Aplica la inversa del escalado para obtener las coordenadas lógicas
        const logicalX = (mouseXCanvas - contentOffsetX) / scaleX;
        const logicalY = (mouseYCanvas - contentOffsetY) / scaleX;  // scaleX = scaleY en este caso
        
        return { x: logicalX, y: logicalY };
    }, [canvasRef, contentWrapperRef]); // Dependencias: canvasRef y contentWrapperRef

    // Borra un elemento en las coordenadas lógicas especificadas.
    const eraseElementAt = useCallback((logicalX, logicalY) => {
        if (!level) return; // Si no hay nivel cargado, no hace nada.

        const x = logicalX;
        const y = logicalY;
        const tolerance = 5; // Pequeño margen para facilitar el clic en elementos.

        // Función auxiliar para determinar si un punto está dentro de un elemento.
        const isPointInElement = (point, element, defaultSize) => {
            const elX = element.x;
            let elY = element.y;
            const elWidth = element.width ?? defaultSize?.width ?? 40;
            const elHeight = element.height ?? defaultSize?.height ?? 40;

            // Ajuste especial para la posición Y de los pinchos, ya que su 'y' es la base.
            if (element instanceof Spike || element.type === 'spike' || (previewElement?.type === 'spike' && element === previewElement)) {
                elY = element.y - elHeight;
            }

            return (
                point.x >= elX - tolerance &&
                point.x <= elX + elWidth + tolerance &&
                point.y >= elY - tolerance &&
                point.y <= elY + elHeight + tolerance
            );
        };

        let changed = false;
        // Filtra las plataformas, eliminando la que coincida con el punto de clic.
        const updatedPlatforms = level.platforms.filter(p => !isPointInElement({ x, y }, p));
        if (updatedPlatforms.length !== level.platforms.length) changed = true;

        // Filtra los obstáculos.
        const updatedObstacles = level.obstacles.filter(o => !isPointInElement({ x, y }, o, { width: o.width || Spike.defaultWidth, height: o.height || Spike.defaultHeight }));
        if (updatedObstacles.length !== level.obstacles.length) changed = true;

        // Filtra los trampolines.
        const updatedTrampolines = level.trampolines.filter(t => !isPointInElement({ x, y }, t, { width: t.width || Trampoline.defaultWidth, height: t.height || Trampoline.defaultHeight }));
        if (updatedTrampolines.length !== level.trampolines.length) changed = true;

        // Filtra los portales (entrada y destino).
        const updatedPortals = level.portals.filter(p => {
            const entryMatch = isPointInElement({ x, y }, p, { width: p.width || Portal.defaultWidth, height: p.height || Portal.defaultHeight });
            const destMatch = p.destination && isPointInElement({ x, y }, { x: p.destination.x, y: p.destination.y, width: 20, height: 20 }); // Tamaño de destino de portal asumido
            return !entryMatch && !destMatch;
        });
        if (updatedPortals.length !== level.portals.length) changed = true;

        const updatedLevel = { ...level };
        // Comprueba y elimina el punto de inicio del jugador.
        if (level.playerStart && isPointInElement({ x, y }, level.playerStart, { width: 40, height: 40 })) {
            updatedLevel.playerStart = { x: 50, y: LOGICAL_LEVEL_HEIGHT - 100 }; // Posición por defecto al borrar
            changed = true;
        }
        // Comprueba y elimina la meta.
        if (level.goal && isPointInElement({ x, y }, level.goal, { width: level.goal.width || Goal.defaultWidth, height: level.goal.height || Goal.defaultHeight })) {
            updatedLevel.goal = new Goal({ x: LOGICAL_LEVEL_WIDTH - 100, y: LOGICAL_LEVEL_HEIGHT - 100 }); // Posición por defecto al borrar
            changed = true;
        }

        // Si se realizó algún cambio, actualiza el estado del nivel.
        if (changed) {
            updatedLevel.platforms = updatedPlatforms;
            updatedLevel.obstacles = updatedObstacles;
            updatedLevel.trampolines = updatedTrampolines;
            updatedLevel.portals = updatedPortals;
            setLevel(updatedLevel);
            setHasUnsavedChanges(true);
        }
    }, [level, setLevel, setHasUnsavedChanges, previewElement]); // Dependencias

    // Maneja el clic principal (izquierdo) en el canvas.
    const handleCanvasClick = useCallback((e) => {
        if (e.button !== 0) return; // Solo procesa el botón izquierdo del ratón.

        const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);

        // Si el modo es 'borrar', llama a la función de borrado y termina.
        if (editorMode === 'erase') {
            eraseElementAt(logicalX, logicalY);
            return;
        }

        // Si el modo no es 'colocar', no hay elemento seleccionado o no hay nivel, no hace nada.
        if (editorMode !== 'place' || !selectedElement || !level) return;

        const elementColor = getActiveColor(isInverted);
        let newElement;
        let changeMade = false;
        let nextLevelState = { ...level };

        // Crea y añade el nuevo elemento según el tipo seleccionado.
        switch (selectedElement) {
            case 'platform':
                newElement = new Platform({ x: logicalX, y: logicalY, color: elementColor, width: platformSize.width, height: platformSize.height });
                nextLevelState.platforms = [...nextLevelState.platforms, newElement];
                changeMade = true;
                break;
            case 'spike':
                newElement = new Spike({ x: logicalX, y: logicalY, color: elementColor });
                nextLevelState.obstacles = [...nextLevelState.obstacles, newElement];
                changeMade = true;
                break;
            case 'trampoline':
                newElement = new Trampoline({ x: logicalX, y: logicalY, color: elementColor });
                nextLevelState.trampolines = [...nextLevelState.trampolines, newElement];
                changeMade = true;
                break;
            case 'portal':
                if (isSelectingPortalDestination && pendingPortal) {
                    // Si estamos seleccionando el destino y hay un portal pendiente, lo finaliza.
                    const finalPortal = new Portal({
                        ...pendingPortal,
                        destination: { x: logicalX, y: logicalY }
                    });
                    nextLevelState.portals = [...nextLevelState.portals, finalPortal];
                    setIsSelectingPortalDestination(false);
                    setPendingPortal(null);
                    changeMade = true;
                } else {
                    // Si no, inicia la creación de un nuevo portal.
                    const newPortalBase = {
                        x: logicalX,
                        y: logicalY,
                        color: elementColor,
                        width: Portal.defaultWidth,
                        height: Portal.defaultHeight,
                        portalId: portalCounter
                    };
                    setPendingPortal(newPortalBase);
                    setIsSelectingPortalDestination(true);
                    setPortalCounter(prev => prev + 1); // Incrementa el contador para el próximo portal.
                }
                break;
            case 'goal':
                newElement = new Goal({ x: logicalX, y: logicalY });
                nextLevelState.goal = newElement;
                changeMade = true;
                break;
            case 'player-start':
                nextLevelState.playerStart = { x: logicalX, y: logicalY };
                changeMade = true;
                break;
            default: break;
        }

        // Si se hizo un cambio, actualiza el nivel.
        if (changeMade) {
            setLevel(nextLevelState);
            setHasUnsavedChanges(true);
        }

        // Si se colocó un portal (no el destino), limpia la previsualización.
        if (selectedElement === 'portal' && !isSelectingPortalDestination) {
             setPreviewElement(null);
        }
    }, [
        level, editorMode, selectedElement, isInverted, platformSize,
        isSelectingPortalDestination, pendingPortal, portalCounter,
        getLogicalCoords, eraseElementAt, setLevel, setHasUnsavedChanges,
        setIsSelectingPortalDestination, setPendingPortal, setPortalCounter, setPreviewElement
    ]);

    // Maneja el clic derecho en el canvas (menú contextual).
    const handleCanvasContextMenu = useCallback((e) => {
        e.preventDefault(); // Previene el menú contextual por defecto del navegador.
        // Si se está seleccionando el destino de un portal, cancela la operación.
        if (isSelectingPortalDestination) {
            setIsSelectingPortalDestination(false);
            setPendingPortal(null);
            setPreviewElement(null);
            // Revierte el contador de portales si se cancela la creación de uno nuevo.
            setPortalCounter(prev => prev > 0 ? prev - 1 : 0);
        }
        // Podría añadirse más lógica aquí si se quisiera un menú contextual personalizado.
    }, [isSelectingPortalDestination, setIsSelectingPortalDestination, setPendingPortal, setPreviewElement, setPortalCounter]);

    // Maneja cuando el ratón sale del área del canvas.
    const handleCanvasMouseLeave = useCallback(() => {
        // Limpia el elemento de previsualización.
        setPreviewElement(null);
    }, [setPreviewElement]);

    // Maneja el movimiento del ratón sobre el canvas para mostrar la previsualización del elemento.
    const handleCanvasMouseMoveForPreview = useCallback((e) => {
        // No muestra previsualización si está en modo borrado, no hay elemento seleccionado,
        // se está seleccionando destino de portal, o el wrapper de contenido no existe.
        if (editorMode === 'erase' || !selectedElement || isSelectingPortalDestination || !contentWrapperRef.current) {
            if (previewElement) setPreviewElement(null); // Limpia si ya había uno.
            return;
        }

        const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);
        const elementColor = getActiveColor(isInverted);
        let newPreviewElement = null;
        const previewX = logicalX;
        const previewY = logicalY;

        // Crea un objeto de previsualización según el elemento seleccionado.
        switch (selectedElement) {
            case 'platform':
                newPreviewElement = { type: 'platform', x: previewX, y: previewY, width: platformSize.width, height: platformSize.height, color: elementColor };
                break;
            case 'spike':
                newPreviewElement = { type: 'spike', x: previewX, y: previewY, width: Spike.defaultWidth, height: Spike.defaultHeight, color: elementColor };
                break;
            case 'trampoline':
                newPreviewElement = { type: 'trampoline', x: previewX, y: previewY, width: Trampoline.defaultWidth, height: Trampoline.defaultHeight, color: elementColor };
                break;
            case 'portal':
                newPreviewElement = {
                    type: 'portal',
                    x: previewX,
                    y: previewY,
                    width: Portal.defaultWidth,
                    height: Portal.defaultHeight,
                    portalId: portalCounter, // Usa el contador actual para el ID de previsualización.
                };
                break;
            case 'goal':
                newPreviewElement = { type: 'goal', x: previewX, y: previewY, width: Goal.defaultWidth, height: Goal.defaultHeight };
                break;
            case 'player-start':
                newPreviewElement = { type: 'player-start', x: previewX, y: previewY, width: 40, height: 40, color: elementColor };
                break;
            default: break;
        }

        // Actualiza el estado de previsualización solo si ha cambiado para evitar re-renders innecesarios.
        if (JSON.stringify(previewElement) !== JSON.stringify(newPreviewElement)) {
            setPreviewElement(newPreviewElement);
        }
    }, [
        editorMode, selectedElement, isSelectingPortalDestination, isInverted,
        platformSize, getLogicalCoords, previewElement, contentWrapperRef, // Añadido contentWrapperRef
        setPreviewElement, portalCounter
    ]);

    // Manejador unificado para movimiento de puntero (ratón y táctil).
    const handlePointerMove = useCallback((e) => {
        const isTouchEvent = e.type.startsWith('touch');
        if (isTouchEvent) {
            const touch = e.touches && e.touches[0];
            if (touch) {
                // Simula un evento de ratón para la previsualización
                handleCanvasMouseMoveForPreview({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    type: 'touchmove',
                    preventDefault: () => e.preventDefault(),
                });
            }
        } else {
            handleCanvasMouseMoveForPreview(e);
        }
    }, [handleCanvasMouseMoveForPreview]);

    // Manejador para touchend: coloca el elemento donde está la previsualización
    const handlePointerUp = useCallback((e) => {
        const isTouchEvent = e.type && e.type.startsWith('touch');
        if (isTouchEvent && previewElement && editorMode === 'place' && selectedElement && level) {
            let newElement;
            let changeMade = false;
            let nextLevelState = { ...level };
            const { x, y, width, height, color, portalId } = previewElement;
            switch (previewElement.type) {
                case 'platform':
                    newElement = new Platform({ x, y, color, width, height });
                    nextLevelState.platforms = [...nextLevelState.platforms, newElement];
                    changeMade = true;
                    break;
                case 'spike':
                    newElement = new Spike({ x, y, color });
                    nextLevelState.obstacles = [...nextLevelState.obstacles, newElement];
                    changeMade = true;
                    break;
                case 'trampoline':
                    newElement = new Trampoline({ x, y, color });
                    nextLevelState.trampolines = [...nextLevelState.trampolines, newElement];
                    changeMade = true;
                    break;
                case 'portal':
                    if (isSelectingPortalDestination && pendingPortal) {
                        const finalPortal = new Portal({
                            ...pendingPortal,
                            destination: { x, y }
                        });
                        nextLevelState.portals = [...nextLevelState.portals, finalPortal];
                        setIsSelectingPortalDestination(false);
                        setPendingPortal(null);
                        changeMade = true;
                    } else {
                        const newPortalBase = {
                            x,
                            y,
                            color,
                            width,
                            height,
                            portalId
                        };
                        setPendingPortal(newPortalBase);
                        setIsSelectingPortalDestination(true);
                        setPortalCounter(prev => prev + 1);
                    }
                    break;
                case 'goal':
                    newElement = new Goal({ x, y });
                    nextLevelState.goal = newElement;
                    changeMade = true;
                    break;
                case 'player-start':
                    nextLevelState.playerStart = { x, y };
                    changeMade = true;
                    break;
                default: break;
            }
            if (changeMade) {
                setLevel(nextLevelState);
                setHasUnsavedChanges(true);
            }
            setPreviewElement(null);
        }
    }, [previewElement, editorMode, selectedElement, level, setLevel, setHasUnsavedChanges, setPreviewElement, isSelectingPortalDestination, pendingPortal, setIsSelectingPortalDestination, setPendingPortal, setPortalCounter]);

    // Devuelve los manejadores para que el componente LevelEditor los pueda usar en el EditorCanvas.
    return {
        handleCanvasClick,
        handleCanvasContextMenu,
        handleCanvasMouseLeave,
        handlePointerMove,
        handlePointerUp
    };
}; 