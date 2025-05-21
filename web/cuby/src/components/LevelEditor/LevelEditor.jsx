// --------- Empieza la sección de importaciones --------
// Aquí se importan varios componentes y hooks de React, así como funciones de ayuda.
// - React y sus hooks (useState, useEffect, useCallback, useRef) son la base para construir la interfaz de usuario.
// - useParams y useNavigate: Hooks de react-router-dom para manejar parámetros de la URL y la navegación.
// - ConfirmationModal: Un componente para mostrar un diálogo de confirmación.
// - useInversion: Un hook personalizado para manejar el estado de inversión de colores (tema claro/oscuro).
// - Componentes de UI estilizados (EditorContainer, EditorCanvas, etc.) desde './LevelEditor.styles'.
// - LevelNameDisplayEdit, Toolbar, ElementsSidebar, etc.: Componentes específicos de la interfaz del editor.
// - Hooks personalizados para la lógica del editor: useLevelManager, useEditorModeManager, useKeyboardShortcuts,
//   useUnsavedChangesWarning, useCanvasInteraction.
// - CanvasRenderer: Un componente encargado de dibujar el nivel en el canvas.
// --------- Fin de la sección de importaciones --------
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal/ConfirmationModal';
import { useInversion } from '../../context/InversionContext';
import {
    EditorContainer,
    EditorCanvas,
} from './LevelEditor.styles';
import LevelNameDisplayEdit from './LevelNameDisplayEdit';
import Toolbar from './Toolbar';
import ElementsSidebar from './ElementsSidebar';
import SaveLevelDialog from './SaveLevelDialog';
import ImportLevelDialog from './ImportLevelDialog';
import ExportLevelDialog from './ExportLevelDialog';
import ImportSuccessDialog from './ImportSuccessDialog';
import { useLevelManager } from './hooks/useLevelManager';
import { useEditorModeManager } from './hooks/useEditorModeManager';

// Nuevos Hooks y Componente de Renderizado
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useUnsavedChangesWarning } from './hooks/useUnsavedChangesWarning';
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import CanvasRenderer from './CanvasRenderer';

// --------- Empieza la definición del componente LevelEditor --------
// Este es el componente principal del Editor de Niveles.
// Funciona como el "cerebro" que coordina todas las partes del editor:
// - La carga, guardado, importación y exportación de niveles (a través de `useLevelManager`).
// - El modo del editor (colocar elementos, borrar elementos) y el elemento seleccionado (a través de `useEditorModeManager`).
// - Las interacciones del usuario con el canvas (clics, movimiento del ratón) (a través de `useCanvasInteraction`).
// - La renderización de la interfaz de usuario, incluyendo la barra de herramientas, el panel lateral de elementos,
//   y varios diálogos modales (guardar, importar, etc.).
// Utiliza varios hooks de React y hooks personalizados para gestionar el estado y la lógica.
// --------- Fin de la definición del componente LevelEditor --------

const LevelEditor = () => {
    // --------- Empieza la sección de Hooks y Estado Inicial --------
    // Aquí se inicializan los hooks y el estado que el componente LevelEditor necesita.
    // - `levelId`: Obtiene el ID del nivel de los parámetros de la URL (ej: /editor/nivel123).
    // - `navigate`: Función de react-router-dom para cambiar de página programáticamente.
    // - `isInverted`, `toggleInversion`: Del hook `useInversion` para manejar el tema claro/oscuro.
    // - `useLevelManager`: Hook personalizado que maneja toda la lógica relacionada con el nivel en sí:
    //   - `level`: El objeto del nivel actual.
    //   - `setLevel`: Función para actualizar el nivel.
    //   - `levelName`, `setLevelName`: Nombre del nivel y función para actualizarlo.
    //   - `hasUnsavedChanges`, `setHasUnsavedChanges`: Estado para rastrear cambios no guardados.
    //   - `saveDialogOpen`, `importDialogOpen`, etc.: Estados para controlar la visibilidad de los diálogos.
    //   - `exportedCode`: El código del nivel cuando se exporta.
    //   - `portalCounter`, `setPortalCounter`: Contador para los IDs de los portales.
    //   - `handleSave`, `handleExport`, etc.: Funciones para manejar las acciones de guardar, exportar, etc.
    // - `useEditorModeManager`: Hook que gestiona el estado del modo del editor:
    //   - `editorMode`, `setEditorMode`: Modo actual (ej: 'place', 'erase').
    //   - `selectedElement`, `setSelectedElement`: Elemento actualmente seleccionado para colocar.
    //   - `previewElement`, `setPreviewElement`: Elemento de previsualización.
    //   - `isSelectingPortalDestination`, `setIsSelectingPortalDestination`: Estado para la colocación de portales.
    //   - `pendingPortal`, `setPendingPortal`: Información del portal pendiente.
    //   - `platformSize`, `setPlatformSize`: Tamaño de la plataforma seleccionada.
    //   - `handleSelectElement`: Función para manejar la selección de un elemento de la barra lateral.
    // - `canvasSize`, `setCanvasSize`: Estado para almacenar las dimensiones del canvas (aunque parece que `setCanvasSize` no se usa directamente para renderizar, sino que se actualiza por `ResizeObserver`).
    // - `isExitConfirmModalOpen`, `setIsExitConfirmModalOpen`: Estado para el modal de confirmación al salir con cambios sin guardar.
    // - `isEditingName`, `setIsEditingName`: Estado para controlar si se está editando el nombre del nivel.
    // - `canvasRef`, `contentWrapperRef`: Referencias (Refs) a los elementos HTML del canvas y su contenedor de contenido.
    // --------- Fin de la sección de Hooks y Estado Inicial --------
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { isInverted, toggleInversion } = useInversion();

    const {
        level,
        setLevel,
        levelName,
        setLevelName,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        saveDialogOpen,
        setSaveDialogOpen,
        importDialogOpen,
        setImportDialogOpen,
        exportDialogOpen,
        setExportDialogOpen,
        importSuccessDialogOpen,
        setImportSuccessDialogOpen,
        exportedCode,
        portalCounter,
        setPortalCounter,
        handleSave,
        handleSaveConfirm,
        handleExport,
        handleImport,
        handleImportConfirm,
    } = useLevelManager(levelId);

    const {
        editorMode,
        setEditorMode,
        selectedElement,
        setSelectedElement,
        previewElement,
        setPreviewElement,
        isSelectingPortalDestination,
        setIsSelectingPortalDestination,
        pendingPortal,
        setPendingPortal,
        platformSize,
        setPlatformSize,
        handleSelectElement,
    } = useEditorModeManager('place');

    const [, setCanvasSize] = useState({ width: 0, height: 0 });
    const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);

    const canvasRef = useRef(null);
    const contentWrapperRef = useRef(null);

    // --------- Empieza la función handleNameInputBlur --------
    // Esta función se ejecuta cuando el campo de entrada del nombre del nivel pierde el foco (onBlur).
    // Si el nombre del nivel ha cambiado y no está vacío, actualiza el nombre en el objeto `level`
    // y marca que hay cambios sin guardar.
    // `useCallback` memoriza la función para optimizar, solo se recrea si cambian `levelName`, `level`, etc.
    // --------- Fin de la función handleNameInputBlur --------
    const handleNameInputBlur = useCallback(() => {
        if (levelName.trim() && levelName !== level?.name) {
            if (level) {
                const updatedLevel = { ...level, name: levelName.trim() };
                setLevel(updatedLevel);
                setHasUnsavedChanges(true);
            }
        }
    }, [levelName, level, setLevel, setHasUnsavedChanges]);

    // --------- Empieza el Hook useEffect para ResizeObserver --------
    // Este `useEffect` se ejecuta después del primer renderizado y cada vez que cambie `canvasRef`.
    // Configura un `ResizeObserver` para observar cambios en el tamaño del elemento del canvas.
    // Cuando el canvas cambia de tamaño, actualiza el estado `canvasSize` (aunque este estado no parece
    // usarse directamente para re-renderizar nada crucial, el observer en sí es útil si se necesita esa info).
    // La función de limpieza (`return () => ...`) se asegura de que el observer se desconecte
    // cuando el componente se desmonte, para evitar fugas de memoria.
    // --------- Fin del Hook useEffect para ResizeObserver --------
    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                setCanvasSize({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        resizeObserver.observe(canvasElement);
        setCanvasSize({ 
            width: canvasElement.getBoundingClientRect().width, 
            height: canvasElement.getBoundingClientRect().height 
        });
        return () => {
            if (canvasElement) {
                resizeObserver.unobserve(canvasElement);
            }
        };
    }, []);

    // --------- Empieza la sección de Hooks Personalizados Adicionales --------
    // Aquí se utilizan otros hooks personalizados para añadir más funcionalidades:
    // - `useKeyboardShortcuts`: Configura atajos de teclado para acciones comunes del editor
    //   (ej: guardar, cancelar selección de portal, invertir colores).
    // - `useUnsavedChangesWarning`: Muestra una advertencia al usuario si intenta salir de la página
    //   o cerrar la pestaña cuando hay cambios sin guardar.
    // --------- Fin de la sección de Hooks Personalizados Adicionales --------
    useKeyboardShortcuts({
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
    });

    useUnsavedChangesWarning(hasUnsavedChanges);

    // --------- Empieza la inicialización del Hook useCanvasInteraction --------
    // Aquí se llama al hook `useCanvasInteraction` que definimos antes.
    // Se le pasan todas las referencias, estados y funciones que necesita para manejar
    // las interacciones del usuario con el canvas (colocar/borrar elementos, previsualización).
    // Devuelve un objeto con las funciones manejadoras de eventos (`handleCanvasClick`, etc.)
    // que se asignarán a los eventos del componente `EditorCanvas` más abajo en el JSX.
    // --------- Fin de la inicialización del Hook useCanvasInteraction --------
    const {
        handleCanvasClick,
        handleCanvasContextMenu,
        handleCanvasMouseLeave,
        handlePointerMove
    } = useCanvasInteraction({
        canvasRef,
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
        previewElement,
        setPreviewElement,
    });

    // --------- Empieza la sección de Funciones de Navegación y Confirmación --------
    // Estas funciones, memorizadas con `useCallback`, manejan la lógica para volver
    // a la lista de niveles, mostrando un modal de confirmación si hay cambios sin guardar.
    // - `handleGoBack`: Si hay cambios, abre el modal; si no, navega directamente.
    // - `handleConfirmExit`: Si el usuario confirma salir, marca que no hay cambios (para evitar doble aviso),
    //   cierra el modal y navega.
    // - `handleCancelExit`: Simplemente cierra el modal de confirmación de salida.
    // --------- Fin de la sección de Funciones de Navegación y Confirmación --------
    const handleGoBack = useCallback(() => {
        if (hasUnsavedChanges) {
            setIsExitConfirmModalOpen(true);
        } else {
            navigate('/user-levels');
        }
    }, [hasUnsavedChanges, navigate]);

    const handleConfirmExit = useCallback(() => {
        setHasUnsavedChanges(false);
        setIsExitConfirmModalOpen(false);
        navigate('/user-levels');
    }, [navigate, setHasUnsavedChanges]);

    const handleCancelExit = useCallback(() => {
        setIsExitConfirmModalOpen(false);
    }, []);

    // --------- Empieza la sección de Renderizado Condicional (Carga) --------
    // Si el objeto `level` aún no se ha cargado (es null o undefined), muestra un mensaje
    // de "Cargando editor...". Esto evita errores si se intenta renderizar el editor
    // antes de que los datos del nivel estén disponibles.
    // --------- Fin de la sección de Renderizado Condicional (Carga) --------
    if (!level) {
        return <div>Cargando editor...</div>;
    }

    // --------- Empieza la sección de Renderizado del Componente (JSX) --------
    // Esta es la estructura principal de la interfaz de usuario del editor, escrita en JSX.
    // - `EditorContainer`: El contenedor principal que ocupa toda la pantalla.
    // - `LevelNameDisplayEdit`: Componente para mostrar y editar el nombre del nivel.
    // - `Toolbar`: La barra de herramientas superior con botones para modo edición, inversión, guardar, etc.
    // - Un `div` que organiza el `EditorCanvas` y `ElementsSidebar` en horizontal.
    //   - `EditorCanvas`: El área donde se dibuja y se interactúa con el nivel.
    //     Se le asignan las funciones manejadoras de eventos obtenidas de `useCanvasInteraction`.
    //     Dentro del canvas, se renderiza el componente `CanvasRenderer`.
    //     - `CanvasRenderer`: Este componente es el responsable de dibujar realmente los elementos
    //       del nivel, la previsualización, el portal pendiente, etc., dentro del canvas.
    //       Usa `contentWrapperRef` para posicionar el contenido lógico del nivel.
    //   - `ElementsSidebar`: La barra lateral donde el usuario selecciona qué elemento colocar.
    // - Diálogos Modales: `SaveLevelDialog`, `ConfirmationModal`, `ImportLevelDialog`, `ExportLevelDialog`,
    //   `ImportSuccessDialog`. Estos se muestran u ocultan según sus respectivos estados (ej: `saveDialogOpen`).
    // La prop `$isInverted` se pasa a muchos componentes estilizados para que puedan adaptar sus colores.
    // --------- Fin de la sección de Renderizado del Componente (JSX) --------
    return (
        <EditorContainer $isInverted={isInverted}>
            <Toolbar
                editorMode={editorMode}
                onSetMode={setEditorMode}
                onToggleInversion={toggleInversion}
                onExportLevel={handleExport}
                onImportLevel={handleImport}
                onSaveLevel={handleSave}
                onGoBack={handleGoBack}
                hasUnsavedChanges={hasUnsavedChanges}
                isLevelLoaded={!!level}
                isInverted={isInverted}
                levelNameComponent={
                    <LevelNameDisplayEdit
                        levelName={levelName}
                        onLevelNameChange={(e) => setLevelName(e.target.value)}
                        onLevelNameSave={handleNameInputBlur}
                        isEditing={isEditingName}
                        setIsEditing={setIsEditingName}
                        $isInverted={isInverted}
                    />
                }
            />

            <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden', position: 'relative' }}>
                <EditorCanvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onContextMenu={handleCanvasContextMenu}
                    onMouseMove={handlePointerMove}
                    onMouseLeave={handleCanvasMouseLeave}
                    onMouseDown={(e) => { if (e.button === 0) { /* Podría iniciar paneo */ } }}
                    onMouseUp={() => { /* Podría terminar paneo */ }}
                    onTouchStart={(e) => { /* Podría iniciar interacción táctil, e.preventDefault() si es necesario */ }}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={() => { /* Podría terminar interacción táctil */ }}
                    $isInverted={isInverted}
                    editorMode={editorMode}
                >
                    <CanvasRenderer
                        ref={contentWrapperRef}
                        level={level}
                        isInverted={isInverted}
                        pendingPortal={pendingPortal}
                        isSelectingPortalDestination={isSelectingPortalDestination}
                        previewElement={previewElement}
                        portalCounter={portalCounter}
                    />
                </EditorCanvas>

                <ElementsSidebar
                    selectedElement={selectedElement}
                    onSelectElement={handleSelectElement}
                    platformSize={platformSize}
                    onPlatformSizeChange={setPlatformSize}
                    $isInverted={isInverted}
                />
            </div>

            <SaveLevelDialog
                isOpen={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
                onConfirm={handleSaveConfirm}
                levelName={levelName}
                onLevelNameChange={(e) => setLevelName(e.target.value)}
                isInverted={isInverted}
            />
            <ConfirmationModal
                isOpen={isExitConfirmModalOpen}
                onClose={handleCancelExit}
                onConfirm={handleConfirmExit}
                message="¿Estás seguro de que quieres salir? Se perderán los cambios no guardados."
                isInverted={isInverted}
            />
            <ImportLevelDialog
                isOpen={importDialogOpen}
                onClose={() => setImportDialogOpen(false)}
                onConfirm={handleImportConfirm}
                isInverted={isInverted}
            />
            <ExportLevelDialog
                isOpen={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                exportCode={exportedCode}
                isInverted={isInverted}
            />
            <ImportSuccessDialog
                isOpen={importSuccessDialogOpen}
                onClose={() => setImportSuccessDialogOpen(false)}
                isInverted={isInverted}
            />
        </EditorContainer>
    );
};

// --------- Empieza la exportación del componente --------
// `export default LevelEditor` hace que el componente `LevelEditor` esté disponible
// para ser importado y utilizado en otras partes de la aplicación.
// --------- Fin de la exportación del componente --------
export default LevelEditor;