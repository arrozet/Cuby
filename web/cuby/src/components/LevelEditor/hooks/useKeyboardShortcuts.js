import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar los atajos de teclado en el editor de niveles.
 * Gestiona acciones como cancelar la selección, cerrar diálogos y alternar la inversión de colores.
 * @param {object} params - Parámetros de configuración del hook.
 * @param {boolean} params.saveDialogOpen - Estado del diálogo de guardado.
 * @param {function} params.setSaveDialogOpen - Función para actualizar el estado del diálogo de guardado.
 * @param {boolean} params.isExitConfirmModalOpen - Estado del modal de confirmación de salida.
 * @param {function} params.setIsExitConfirmModalOpen - Función para actualizar el estado del modal de confirmación de salida.
 * @param {boolean} params.isSelectingPortalDestination - Estado de selección del destino del portal.
 * @param {function} params.setIsSelectingPortalDestination - Función para actualizar el estado de selección del destino del portal.
 * @param {function} params.setPendingPortal - Función para actualizar el portal pendiente.
 * @param {function} params.setPreviewElement - Función para actualizar el elemento de previsualización.
 * @param {function} params.setSelectedElement - Función para actualizar el elemento seleccionado.
 * @param {function} params.toggleInversion - Función para alternar la inversión de colores.
 * @returns {object} - Objeto vacío, ya que este hook solo maneja efectos secundarios.
 */
export const useKeyboardShortcuts = ({
    saveDialogOpen,
    setSaveDialogOpen,
    isExitConfirmModalOpen,
    setIsExitConfirmModalOpen,
    isSelectingPortalDestination,
    setIsSelectingPortalDestination,
    setPendingPortal,
    setPreviewElement,
    setSelectedElement,
    toggleInversion,
}) => {
    const [eKeyPressed, setEKeyPressed] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Maneja la tecla 'Escape'
            if (e.key === 'Escape') {
                if (saveDialogOpen) {
                    setSaveDialogOpen(false);
                    return;
                }
                if (isExitConfirmModalOpen) {
                    setIsExitConfirmModalOpen(false);
                    return;
                }
                if (isSelectingPortalDestination) {
                    setIsSelectingPortalDestination(false);
                    setPendingPortal(null);
                    setPreviewElement(null);
                    return;
                }
                // Si no hay diálogos abiertos ni selección de portal, cancela la selección actual
                setSelectedElement(null);
                setPreviewElement(null);
            }

            // Maneja la tecla 'E' para la inversión de colores
            // Solo funciona si no hay diálogos abiertos y ningún input está activo
            if (
                e.key.toLowerCase() === 'e' &&
                !eKeyPressed &&
                !saveDialogOpen &&
                !isExitConfirmModalOpen &&
                document.activeElement?.tagName !== 'INPUT'
            ) {
                setEKeyPressed(true);
                toggleInversion();
            }
        };

        const handleKeyUp = (e) => {
            if (e.key.toLowerCase() === 'e') {
                setEKeyPressed(false);
            }
        };

        // Añade los listeners de eventos al montar el componente
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Limpia los listeners al desmontar el componente
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [
        toggleInversion,
        eKeyPressed,
        saveDialogOpen,
        isExitConfirmModalOpen,
        isSelectingPortalDestination,
        setSaveDialogOpen,
        setIsExitConfirmModalOpen,
        setIsSelectingPortalDestination,
        setPendingPortal,
        setPreviewElement,
        setSelectedElement,
    ]);

    // Este hook no necesita devolver ningún valor visible, solo gestiona efectos.
    return {};
}; 