import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook personalizado para gestionar las transformaciones del canvas, como el zoom y el paneo.
 * @param {object} config - Configuración para el hook.
 * @param {object} config.canvasSize - Dimensiones actuales del canvas ({ width, height }).
 * @param {number} config.logicalWidth - Ancho lógico del nivel.
 * @param {number} config.logicalHeight - Alto lógico del nivel.
 * @param {number} config.minZoom - Nivel mínimo de zoom permitido.
 * @param {number} config.maxZoom - Nivel máximo de zoom permitido.
 * @param {number} config.zoomStep - Factor por el cual el zoom cambia en cada paso.
 * @param {string} config.currentEditorMode - Modo actual del editor (ej. 'pan', 'place').
 * @returns {object} Objeto con el estado y las funciones para manipular la transformación del canvas.
 * @returns {number} object.zoomLevel - Nivel de zoom actual.
 * @returns {object} object.viewOffset - Desplazamiento actual de la vista ({ x, y }).
 * @returns {boolean} object.isPanning - Indica si el paneo está activo.
 * @returns {Function} object.zoomIn - Función para acercar el zoom.
 * @returns {Function} object.zoomOut - Función para alejar el zoom.
 * @returns {Function} object.panStart - Función para iniciar el paneo.
 * @returns {Function} object.panMove - Función para mover el canvas durante el paneo.
 * @returns {Function} object.panEnd - Función para finalizar el paneo.
 */
export const useCanvasTransform = ({
    canvasSize,
    logicalWidth,
    logicalHeight,
    minZoom,
    maxZoom,
    zoomStep,
    currentEditorMode,
}) => {
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);

    const dragStartCoords = useRef({ x: 0, y: 0 });
    const initialPanViewOffset = useRef({ x: 0, y: 0 });

    /**
     * Efecto para ajustar el zoom y el offset inicial cuando el tamaño del canvas cambia,
     * intentando encajar el nivel lógico dentro del canvas visible.
     */
    useEffect(() => {
        if (canvasSize && canvasSize.width > 0 && canvasSize.height > 0) {
            const scaleX = canvasSize.width / logicalWidth;
            const scaleY = canvasSize.height / logicalHeight;
            const fitScale = Math.min(scaleX, scaleY) * 0.95;
            const clampedZoom = Math.max(minZoom, Math.min(maxZoom, fitScale));
            setZoomLevel(clampedZoom);

            const offsetX = (canvasSize.width - logicalWidth * clampedZoom) / 2;
            const offsetY = (canvasSize.height - logicalHeight * clampedZoom) / 2;
            setViewOffset({ x: offsetX, y: offsetY });
        }
    }, [canvasSize, logicalWidth, logicalHeight, minZoom, maxZoom]);

    /**
     * Función para aumentar el nivel de zoom.
     */
    const zoomIn = useCallback(() => {
        setZoomLevel(prev => Math.min(maxZoom, prev * zoomStep));
    }, [maxZoom, zoomStep]);

    /**
     * Función para disminuir el nivel de zoom.
     */
    const zoomOut = useCallback(() => {
        setZoomLevel(prev => Math.max(minZoom, prev / zoomStep));
    }, [minZoom, zoomStep]);

    /**
     * Inicia el proceso de paneo.
     * Solo se activa si el modo actual del editor es 'pan'.
     * @param {number} clientX - Coordenada X del cliente donde inicia el paneo.
     * @param {number} clientY - Coordenada Y del cliente donde inicia el paneo.
     */
    const panStart = useCallback((clientX, clientY) => {
        if (currentEditorMode !== 'pan') return;
        setIsPanning(true);
        dragStartCoords.current = { x: clientX, y: clientY };
        initialPanViewOffset.current = { ...viewOffset };
    }, [currentEditorMode, viewOffset]);

    /**
     * Gestiona el movimiento durante el paneo.
     * Actualiza el offset de la vista basado en el delta del movimiento del ratón/táctil.
     * @param {number} clientX - Coordenada X actual del cliente.
     * @param {number} clientY - Coordenada Y actual del cliente.
     * @param {Event} event - Evento de movimiento (opcional, para prevenir scroll en táctil).
     */
    const panMove = useCallback((clientX, clientY, event) => {
        if (currentEditorMode !== 'pan' || !isPanning) return;
        
        const deltaX = clientX - dragStartCoords.current.x;
        const deltaY = clientY - dragStartCoords.current.y;
        
        setViewOffset({
            x: initialPanViewOffset.current.x + deltaX,
            y: initialPanViewOffset.current.y + deltaY,
        });
    }, [currentEditorMode, isPanning]);

    /**
     * Finaliza el proceso de paneo.
     */
    const panEnd = useCallback(() => {
        if (isPanning) {
            setIsPanning(false);
        }
    }, [isPanning]);

    return {
        zoomLevel,
        viewOffset,
        isPanning,
        zoomIn,
        zoomOut,
        panStart,
        panMove,
        panEnd,
    };
};
