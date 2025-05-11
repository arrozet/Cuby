import { useState, useCallback } from 'react';

/**
 * Hook personalizado para gestionar el modo del editor y la selección de elementos.
 * @param {string} [initialEditorMode='place'] - Modo inicial del editor.
 * @returns {object} Objeto con el estado y las funciones para gestionar el modo del editor.
 * @returns {string} object.editorMode - Modo actual del editor (ej. 'place', 'erase', 'pan').
 * @returns {Function} object.setEditorMode - Función para cambiar el modo del editor.
 * @returns {string} object.previousEditorMode - Modo del editor antes de cambiar a 'pan'.
 * @returns {string|null} object.selectedElement - Elemento actualmente seleccionado para colocar.
 * @returns {Function} object.setSelectedElement - Función para cambiar el elemento seleccionado.
 * @returns {object|null} object.previewElement - Objeto que representa el elemento en previsualización.
 * @returns {Function} object.setPreviewElement - Función para actualizar el elemento en previsualización.
 * @returns {boolean} object.isSelectingPortalDestination - Indica si se está seleccionando el destino de un portal.
 * @returns {Function} object.setIsSelectingPortalDestination - Función para actualizar el estado de selección de destino del portal.
 * @returns {object|null} object.pendingPortal - Información del portal cuya entrada ha sido colocada y espera destino.
 * @returns {Function} object.setPendingPortal - Función para actualizar el portal pendiente.
 * @returns {object} object.platformSize - Dimensiones de la plataforma a colocar ({ width, height }).
 * @returns {Function} object.setPlatformSize - Función para actualizar las dimensiones de la plataforma.
 * @returns {Function} object.handleSelectElement - Manejador para seleccionar un tipo de elemento a colocar.
 * @returns {Function} object.handlePanModeToggle - Manejador para activar/desactivar el modo de paneo.
 */
export const useEditorModeManager = (initialEditorMode = 'place') => {
    const [editorMode, setEditorModeState] = useState(initialEditorMode);
    const [previousEditorMode, setPreviousEditorMode] = useState(initialEditorMode);
    const [selectedElement, setSelectedElement] = useState(null);
    const [previewElement, setPreviewElement] = useState(null);
    const [isSelectingPortalDestination, setIsSelectingPortalDestination] = useState(false);
    const [pendingPortal, setPendingPortal] = useState(null);
    const [platformSize, setPlatformSize] = useState({ width: 100, height: 20 });

    /**
     * Maneja la selección de un elemento de la barra lateral.
     * Establece el elemento seleccionado y cambia el modo a 'place'.
     * @param {string} elementName - Nombre del elemento seleccionado.
     */
    const handleSelectElement = useCallback((elementName) => {
        setSelectedElement(elementName);
        setEditorModeState('place'); // Always switch to 'place' mode
        setIsSelectingPortalDestination(false);
        setPendingPortal(null);
        // Preview update will be handled by mouse move
    }, []);

    /**
     * Establece el modo actual del editor.
     * Realiza acciones adicionales según el modo (ej. limpiar selección en 'erase').
     * @param {string} newMode - Nuevo modo para el editor.
     */
    const setEditorMode = useCallback((newMode) => {
        setEditorModeState(newMode);
        if (newMode === 'erase') {
            setSelectedElement(null);
            setPreviewElement(null);
        } else if (newMode === 'place') {
            if (!selectedElement) {
                // Optionally default to a specific element if nothing is selected
                // setSelectedElement('platform'); 
            }
        } else if (newMode === 'pan') {
            // This case is mostly handled by handlePanModeToggle, 
            // but if setMode is called directly with 'pan':
            setPreviewElement(null); 
        }
    }, [selectedElement]);

    /**
     * Alterna el modo de paneo (pan).
     * Guarda el modo anterior para poder restaurarlo al salir del modo 'pan'.
     */
    const handlePanModeToggle = useCallback(() => {
        setEditorModeState(prevMode => {
            if (prevMode === 'pan') {
                return previousEditorMode || 'place';
            } else {
                setPreviousEditorMode(prevMode);
                setSelectedElement(null);
                setPreviewElement(null);
                return 'pan';
            }
        });
    }, [previousEditorMode]);

    return {
        editorMode,
        setEditorMode, // Use this for direct mode setting (e.g., from toolbar)
        previousEditorMode,
        selectedElement,
        setSelectedElement, // Allow direct setting if needed
        previewElement,
        setPreviewElement,
        isSelectingPortalDestination,
        setIsSelectingPortalDestination,
        pendingPortal,
        setPendingPortal,
        platformSize,
        setPlatformSize,
        handleSelectElement, // For element selection buttons
        handlePanModeToggle, // For spacebar or pan button
    };
};
