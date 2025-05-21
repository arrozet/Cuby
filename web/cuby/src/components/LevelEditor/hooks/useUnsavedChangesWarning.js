import { useEffect } from 'react';

/**
 * Hook personalizado para advertir al usuario sobre cambios no guardados al intentar salir de la página.
 * @param {boolean} hasUnsavedChanges - Indica si hay cambios sin guardar.
 */
export const useUnsavedChangesWarning = (hasUnsavedChanges) => {
    useEffect(() => {
        // Si no hay cambios sin guardar, no hace nada.
        if (!hasUnsavedChanges) return;

        // Define el manejador del evento 'beforeunload'
        const handleBeforeUnload = (e) => {
            e.preventDefault(); // Requerido por algunos navegadores
            e.returnValue = 'Hay cambios sin guardar. ¿Estás seguro de que quieres salir?'; // Mensaje estándar
            return e.returnValue; // Requerido por otros navegadores
        };

        // Añade el listener del evento al montar o cuando cambie 'hasUnsavedChanges'
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Limpia el listener al desmontar el componente o cuando 'hasUnsavedChanges' se vuelva falso
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Este hook no necesita devolver ningún valor visible, solo gestiona efectos.
    return {};
}; 