import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal/ConfirmationModal';
import { useInversion } from '../../context/InversionContext';
import {
    EditorContainer,
    EditorCanvas,
    LevelContentWrapper,
} from './LevelEditor.styles';
import LevelNameDisplayEdit from './LevelNameDisplayEdit';
import Toolbar from './Toolbar';
import ElementsSidebar from './ElementsSidebar';
import CanvasZoomControls from './CanvasZoomControls';
import SaveLevelDialog from './SaveLevelDialog';
import ImportLevelDialog from './ImportLevelDialog';
import ExportLevelDialog from './ExportLevelDialog';
import ImportSuccessDialog from './ImportSuccessDialog';
import { useCanvasTransform } from './hooks/useCanvasTransform';
import { useLevelManager } from './hooks/useLevelManager';
import { useEditorModeManager } from './hooks/useEditorModeManager';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

// Clases de datos (para defaults y creación de nuevos elementos)
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';

// NUEVOS COMPONENTES DE VISUALIZACIÓN
import PlatformDisplay from '../GameElements/PlatformDisplay';
import SpikeDisplay from '../GameElements/SpikeDisplay';
import TrampolineDisplay from '../GameElements/TrampolineDisplay';
import PortalDisplay from '../GameElements/PortalDisplay';
import GoalDisplay from '../GameElements/GoalDisplay';
import PlayerStartDisplay from '../GameElements/PlayerStartDisplay';


const LOGICAL_LEVEL_WIDTH = 1200;
const LOGICAL_LEVEL_HEIGHT = 800;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 1.2;

const LevelEditor = () => {
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
        handlePanModeToggle,
    } = useEditorModeManager('place');

    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const {
        zoomLevel,
        viewOffset,
        isPanning,
        zoomIn,
        zoomOut,
        panStart,
        panMove,
        panEnd,
    } = useCanvasTransform({
        canvasSize,
        logicalWidth: LOGICAL_LEVEL_WIDTH,
        logicalHeight: LOGICAL_LEVEL_HEIGHT,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        zoomStep: ZOOM_STEP,
        currentEditorMode: editorMode,
    });

    const [eKeyPressed, setEKeyPressed] = useState(false);
    const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);

    const canvasRef = useRef(null);
    const contentWrapperRef = useRef(null);

    const handleNameInputBlur = useCallback(() => {
        if (levelName.trim() && levelName !== level?.name) {
            setLevel(prev => ({ ...prev, name: levelName.trim() }));
            setHasUnsavedChanges(true);
        }
    }, [levelName, level, setLevel, setHasUnsavedChanges]);

    useEffect(() => {
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;
        const resizeObserver = new ResizeObserver(entries => {
            entries.forEach(entry => setCanvasSize(entry.contentRect));
        });
        resizeObserver.observe(canvasElement);
        setCanvasSize(canvasElement.getBoundingClientRect());
        return () => {
            if (canvasElement) resizeObserver.unobserve(canvasElement);
        };
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (saveDialogOpen) { setSaveDialogOpen(false); return; }
                if (isExitConfirmModalOpen) { setIsExitConfirmModalOpen(false); return; }
                if (isSelectingPortalDestination) {
                    setIsSelectingPortalDestination(false);
                    setPendingPortal(null);
                    setPreviewElement(null);
                    return;
                }
                if (editorMode === 'pan') {
                    handlePanModeToggle();
                    return;
                }
                setSelectedElement(null);
                setPreviewElement(null);
            }
            if (e.key.toLowerCase() === 'e' && !eKeyPressed && !saveDialogOpen && !isExitConfirmModalOpen && document.activeElement?.tagName !== 'INPUT') {
                setEKeyPressed(true);
                toggleInversion();
            }
            if (document.activeElement?.tagName !== 'INPUT' && !saveDialogOpen && !isExitConfirmModalOpen) {
                if (e.key === '+' || e.key === '=') { zoomIn(); e.preventDefault(); }
                if (e.key === '-' || e.key === '_') { zoomOut(); e.preventDefault(); }
                if (e.key === ' ') {
                    e.preventDefault();
                    handlePanModeToggle();
                }
            }
        };
        const handleKeyUp = (e) => {
            if (e.key.toLowerCase() === 'e') {
                setEKeyPressed(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [
        toggleInversion, eKeyPressed, saveDialogOpen, isExitConfirmModalOpen,
        isSelectingPortalDestination, editorMode, zoomIn, zoomOut, handlePanModeToggle,
        setIsSelectingPortalDestination, setPendingPortal, setPreviewElement, setSelectedElement,
        setSaveDialogOpen,
    ]);

    useEffect(() => {
        if (!hasUnsavedChanges) return;
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = 'Hay cambios sin guardar.';
            return e.returnValue;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const getLogicalCoords = useCallback((clientX, clientY) => {
        if (!contentWrapperRef.current || !canvasRef.current) return { x: 0, y: 0 };
        const canvasRect = canvasRef.current.getBoundingClientRect();
        const mouseXCanvas = clientX - canvasRect.left;
        const mouseYCanvas = clientY - canvasRect.top;
        const logicalX = (mouseXCanvas - viewOffset.x) / zoomLevel;
        const logicalY = (mouseYCanvas - viewOffset.y) / zoomLevel;
        return { x: logicalX, y: logicalY };
    }, [zoomLevel, viewOffset]);

    const eraseElementAt = useCallback((logicalX, logicalY) => {
        if (!level) return;
        const x = logicalX;
        const y = logicalY;
        const tolerance = 5 / zoomLevel; // Tolerancia para click, ajustada por zoom

        const isPointInElement = (point, element, defaultSize) => {
            const elX = element.x;
            // Para los pinchos, la y lógica es la base, pero se dibujan hacia arriba.
            // Para la detección de colisión, necesitamos la y visual (esquina superior-izquierda).
            let elY = element.y;
            const elWidth = element.width ?? defaultSize?.width ?? 40; // Valor por defecto genérico si no se provee
            const elHeight = element.height ?? defaultSize?.height ?? 40;

            if (element instanceof Spike || element.type === 'spike' || (previewElement?.type === 'spike' && element === previewElement)) {
                // Si el elemento es un pincho (o una previsualización de pincho), su 'y' es la base.
                // El área sensible al clic va desde 'y - altura' hasta 'y'.
                elY = element.y - elHeight;
            }
            // Si es otro tipo de elemento, su 'y' ya es la esquina superior izquierda.

            return (point.x >= elX - tolerance &&
                point.x <= elX + elWidth + tolerance &&
                point.y >= elY - tolerance && // Usamos la 'elY' ajustada
                point.y <= elY + elHeight + tolerance);
        };


        let changed = false;
        const updatedPlatforms = level.platforms.filter(p => !isPointInElement({ x, y }, p));
        if (updatedPlatforms.length !== level.platforms.length) changed = true;

        const updatedObstacles = level.obstacles.filter(o => !isPointInElement({ x, y }, o, { width: o.width || Spike.defaultWidth, height: o.height || Spike.defaultHeight }));
        if (updatedObstacles.length !== level.obstacles.length) changed = true;

        const updatedTrampolines = level.trampolines.filter(t => !isPointInElement({ x, y }, t, { width: t.width || Trampoline.defaultWidth, height: t.height || Trampoline.defaultHeight }));
        if (updatedTrampolines.length !== level.trampolines.length) changed = true;

        // Para portales, se puede borrar haciendo clic en la entrada o en el destino (si existe)
        const updatedPortals = level.portals.filter(p => {
            const entryMatch = isPointInElement({ x, y }, p, { width: p.width || Portal.defaultWidth, height: p.height || Portal.defaultHeight });
            // El destino del portal es un punto, lo tratamos como un pequeño cuadrado para el clic
            const destMatch = p.destination && isPointInElement({ x, y }, { x: p.destination.x, y: p.destination.y, width: 20, height: 20 });
            return !entryMatch && !destMatch;
        });
        if (updatedPortals.length !== level.portals.length) changed = true;


        const updatedLevel = { ...level };
        if (level.playerStart && isPointInElement({ x, y }, level.playerStart, { width: 40, height: 40 })) { // Tamaño de PlayerStart
            updatedLevel.playerStart = { x: 50, y: LOGICAL_LEVEL_HEIGHT - 100 }; // Posición por defecto si se borra
            changed = true;
        }
        if (level.goal && isPointInElement({ x, y }, level.goal, { width: level.goal.width || Goal.defaultWidth, height: level.goal.height || Goal.defaultHeight })) {
            updatedLevel.goal = new Goal({ x: LOGICAL_LEVEL_WIDTH - 100, y: LOGICAL_LEVEL_HEIGHT - 100 }); // Posición por defecto
            changed = true;
        }

        if (changed) {
            updatedLevel.platforms = updatedPlatforms;
            updatedLevel.obstacles = updatedObstacles;
            updatedLevel.trampolines = updatedTrampolines;
            updatedLevel.portals = updatedPortals;
            setLevel(updatedLevel);
            setHasUnsavedChanges(true);
        }
    }, [level, zoomLevel, setLevel, setHasUnsavedChanges, previewElement]);


    const handleCanvasClick = useCallback((e) => {
        if (editorMode === 'pan' || e.button !== 0) return; // Ignorar si paneando o no es click izquierdo
        const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);

        if (editorMode === 'erase') {
            eraseElementAt(logicalX, logicalY);
            return;
        }

        if (editorMode !== 'place' || !selectedElement || !level) return;

        const elementColor = getActiveColor(isInverted);
        let newElement;
        let changeMade = false;
        let nextLevelState = { ...level };

        switch (selectedElement) {
            case 'platform':
                newElement = new Platform({ x: logicalX, y: logicalY, color: elementColor, width: platformSize.width, height: platformSize.height });
                nextLevelState.platforms = [...nextLevelState.platforms, newElement];
                changeMade = true;
                break;
            case 'spike':
                // La 'y' lógica para Spike es su base.
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
                    const finalPortal = new Portal({
                        ...pendingPortal, // x, y, color, width, height, portalId de la entrada
                        destination: { x: logicalX, y: logicalY } // Destino
                    });
                    nextLevelState.portals = [...nextLevelState.portals, finalPortal];
                    setIsSelectingPortalDestination(false);
                    setPendingPortal(null);
                    // portalCounter ya se incrementó al iniciar el portal, no aquí
                    changeMade = true;
                } else {
                    // Iniciar la colocación de un nuevo portal
                    const newPortalBase = {
                        x: logicalX,
                        y: logicalY,
                        color: elementColor, // Color lógico, PortalDisplay usa 'purple' visualmente
                        width: Portal.defaultWidth,
                        height: Portal.defaultHeight,
                        portalId: portalCounter // Asigna el ID actual
                    };
                    setPendingPortal(newPortalBase);
                    setIsSelectingPortalDestination(true);
                    setPortalCounter(prev => prev + 1); // Incrementar para el *próximo* portal
                    // No hay cambio en 'level' todavía, solo estado de UI
                }
                break;
            case 'goal':
                newElement = new Goal({ x: logicalX, y: logicalY }); // Goal no tiene color
                nextLevelState.goal = newElement;
                changeMade = true;
                break;
            case 'player-start':
                nextLevelState.playerStart = { x: logicalX, y: logicalY }; // PlayerStart no tiene color como propiedad, usa el activo
                changeMade = true;
                break;
            default: break;
        }

        if (changeMade) {
            setLevel(nextLevelState);
            setHasUnsavedChanges(true);
        }

        // Si se colocó un portal (no sólo su destino), y no estamos esperando destino, limpiar preview
        if (selectedElement === 'portal' && !isSelectingPortalDestination) {
             setPreviewElement(null); // Limpia la preview del portal de entrada si ya se completó
        }
    }, [
        level, editorMode, selectedElement, isInverted, platformSize,
        isSelectingPortalDestination, pendingPortal, portalCounter,
        getLogicalCoords, eraseElementAt, setLevel, setHasUnsavedChanges,
        setIsSelectingPortalDestination, setPendingPortal, setPortalCounter, setPreviewElement
    ]);

    const handleCanvasContextMenu = useCallback((e) => {
        e.preventDefault();
        if (isSelectingPortalDestination) {
            setIsSelectingPortalDestination(false);
            setPendingPortal(null);
            setPreviewElement(null);
            // Revertir el contador de portal si cancelamos la creación de uno nuevo
            setPortalCounter(prev => prev > 0 ? prev - 1 : 0); // Asegura no ir a negativo
        } else if (editorMode === 'place' || editorMode === 'erase') {
            handlePanModeToggle();
        }
    }, [isSelectingPortalDestination, editorMode, handlePanModeToggle, setIsSelectingPortalDestination, setPendingPortal, setPreviewElement, setPortalCounter]);

    const handleCanvasMouseLeave = useCallback(() => {
        setPreviewElement(null);
        if (isPanning) {
            panEnd();
        }
    }, [panEnd, isPanning, setPreviewElement]);

    const handleCanvasMouseMoveForPreview = useCallback((e) => {
        if (editorMode === 'pan' || editorMode === 'erase' || !selectedElement || isSelectingPortalDestination || !contentWrapperRef.current || isPanning) {
            if (previewElement) setPreviewElement(null);
            return;
        }

        const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);
        const elementColor = getActiveColor(isInverted); // Color lógico para el elemento
        let newPreviewElement = null;
        const previewX = logicalX;
        const previewY = logicalY;

        switch (selectedElement) {
            case 'platform':
                newPreviewElement = { type: 'platform', x: previewX, y: previewY, width: platformSize.width, height: platformSize.height, color: elementColor };
                break;
            case 'spike':
                // Para Spike, la 'y' es la base. El componente Display lo manejará.
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
                    // color: 'purple', // PortalDisplay ya lo sabe, no es necesario aquí
                    portalId: portalCounter, // Usamos el portalCounter actual para la previsualización del ID
                };
                break;
            case 'goal':
                newPreviewElement = { type: 'goal', x: previewX, y: previewY, width: Goal.defaultWidth, height: Goal.defaultHeight }; // Goal no usa color
                break;
            case 'player-start':
                newPreviewElement = { type: 'player-start', x: previewX, y: previewY, width: 40, height: 40, color: elementColor }; // player-start usa el color activo
                break;
            default: break;
        }

        if (JSON.stringify(previewElement) !== JSON.stringify(newPreviewElement)) {
            setPreviewElement(newPreviewElement);
        }
    }, [
        editorMode, selectedElement, isSelectingPortalDestination, isInverted,
        platformSize, getLogicalCoords, previewElement, isPanning,
        setPreviewElement, portalCounter // Añadir portalCounter a las dependencias
    ]);

    const handlePointerMove = useCallback((e) => {
        const isTouchEvent = e.type.startsWith('touch');
        const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

        if (editorMode === 'pan' && isPanning) {
            panMove(clientX, clientY, e);
        } else if (!isTouchEvent) { // Previsualización solo para ratón
            handleCanvasMouseMoveForPreview(e);
        }
    }, [editorMode, panMove, handleCanvasMouseMoveForPreview, isPanning]);

    const handleGoBack = useCallback(() => {
        if (hasUnsavedChanges) {
            setIsExitConfirmModalOpen(true);
        } else {
            navigate('/user-levels');
        }
    }, [hasUnsavedChanges, navigate]);

    const handleConfirmExit = useCallback(() => {
        setHasUnsavedChanges(false); // Marcar como que ya no hay cambios (o se descartaron)
        setIsExitConfirmModalOpen(false);
        navigate('/user-levels');
    }, [navigate, setHasUnsavedChanges]);

    const handleCancelExit = useCallback(() => {
        setIsExitConfirmModalOpen(false);
    }, []);

    if (!level) {
        return <div>Cargando editor...</div>;
    }

    // eslint-disable-next-line no-unused-vars
    const oppositeColor = getInactiveColor(isInverted); // Para referencia si se necesita
    // eslint-disable-next-line no-unused-vars
    const currentColor = getActiveColor(isInverted); // Para referencia si se necesita

    // getPreviewStyle ya no es necesaria, la hemos borrado.

    return (
        <EditorContainer $isInverted={isInverted}>
            <LevelNameDisplayEdit
                levelName={levelName}
                onLevelNameChange={(e) => setLevelName(e.target.value)}
                onLevelNameSave={handleNameInputBlur}
                isEditing={isEditingName}
                setIsEditing={setIsEditingName}
                $isInverted={isInverted}
            />
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
            />

            <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden', position: 'relative' }}>
                <EditorCanvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onContextMenu={handleCanvasContextMenu}
                    onMouseMove={handlePointerMove}
                    onMouseDown={(e) => { if (e.button === 0) panStart(e.clientX, e.clientY); }}
                    onMouseUp={panEnd}
                    onMouseLeave={handleCanvasMouseLeave}
                    onTouchStart={(e) => {
                        const touch = e.touches[0];
                        panStart(touch.clientX, touch.clientY);
                    }}
                    onTouchMove={(e) => {
                        const touch = e.touches[0];
                        handlePointerMove({
                            ...e,
                            clientX: touch.clientX,
                            clientY: touch.clientY
                        });
                    }}
                    onTouchEnd={panEnd}
                    $isInverted={isInverted}
                    $isDragging={isPanning}
                    $editorMode={editorMode}
                >
                    <LevelContentWrapper
                        ref={contentWrapperRef}
                        $logicalWidth={LOGICAL_LEVEL_WIDTH}
                        $logicalHeight={LOGICAL_LEVEL_HEIGHT}
                        $isInverted={isInverted}
                        style={{
                            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoomLevel})`,
                            transformOrigin: 'top left',
                        }}
                    >
                        {/* DIBUJAR PLATAFORMAS */}
                        {level.platforms.map((platform, index) => (
                            <PlatformDisplay
                                key={`platform-${index}`}
                                {...platform}
                                $isInverted={isInverted}
                            />
                        ))}

                        {/* DIBUJAR PINCHOS (OBSTÁCULOS) */}
                        {level.obstacles.map((obstacle, index) => (
                            <SpikeDisplay
                                key={`obstacle-${index}`}
                                {...obstacle}
                                width={obstacle.width || Spike.defaultWidth}
                                height={obstacle.height || Spike.defaultHeight}
                                $isInverted={isInverted}
                            />
                        ))}

                        {/* DIBUJAR TRAMPOLINES */}
                        {level.trampolines.map((trampoline, index) => (
                            <TrampolineDisplay
                                key={`trampoline-${index}`}
                                {...trampoline}
                                width={trampoline.width || Trampoline.defaultWidth}
                                height={trampoline.height || Trampoline.defaultHeight}
                                $isInverted={isInverted}
                            />
                        ))}

                        {/* DIBUJAR PORTALES */}
                        {level.portals.map((portal, index) => (
                            <PortalDisplay
                                key={`portal-${index}`}
                                {...portal}
                                width={portal.width || Portal.defaultWidth}
                                height={portal.height || Portal.defaultHeight}
                                $isInverted={isInverted}
                            />
                        ))}

                        {/* DIBUJAR META (GOAL) */}
                        {level.goal && (
                            <GoalDisplay
                                {...level.goal}
                                width={level.goal.width || Goal.defaultWidth}
                                height={level.goal.height || Goal.defaultHeight}
                                $isInverted={isInverted}
                            />
                        )}

                        {/* DIBUJAR INICIO DEL JUGADOR (PLAYERSTART) */}
                        {level.playerStart && (
                            <PlayerStartDisplay
                                {...level.playerStart}
                                $isInverted={isInverted}
                            />
                        )}

                        {/* DIBUJAR PORTAL PENDIENTE (cuando se está colocando el destino) */}
                        {/* Este portal se muestra cuando 'pendingPortal' tiene datos Y 'isSelectingPortalDestination' es true. */}
                        {/* El PortalDisplay se encarga de mostrar solo la entrada si no hay 'destination'. */}
                        {pendingPortal && isSelectingPortalDestination && (
                            <PortalDisplay
                                x={pendingPortal.x}
                                y={pendingPortal.y}
                                width={pendingPortal.width || Portal.defaultWidth}
                                height={pendingPortal.height || Portal.defaultHeight}
                                portalId={pendingPortal.portalId} // El ID ya se asignó a pendingPortal
                                // No hay destination aquí, solo se muestra la entrada
                                $isInverted={isInverted}
                                // Podrías añadir una prop como 'isPendingVisual' para darle un estilo diferente
                            />
                        )}


                        {/* DIBUJAR ELEMENTO DE VISTA PREVIA (cuando mueves el ratón antes de hacer clic) */}
                        {previewElement && (
                            // Contenedor para aplicar opacidad global a la previsualización
                            <div style={{
                                position: 'absolute', // Necesario para que left/top funcionen
                                left: '0px', // No afecta la posición del hijo si el hijo también es absoluto
                                top: '0px',
                                opacity: 0.5,
                                pointerEvents: 'none', // Importante para que no interfiera con los clics en el canvas
                                width: '100%', // Ocupa todo el LevelContentWrapper
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
                                        // No destination en la previsualización inicial de un portal
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
                    </LevelContentWrapper>

                    <CanvasZoomControls
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onTogglePanMode={handlePanModeToggle}
                        isPanModeActive={editorMode === 'pan'}
                        $isInverted={isInverted}
                    />

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
                                zIndex: 50, // Encima de otros elementos del canvas
                                opacity: 0.9,
                                fontSize: '14px',
                                pointerEvents: 'none' // Para no interferir con los clics
                            }}
                        >
                            {/* El portalCounter ya se incrementó, así que mostramos el ID del portal que se está creando (pendingPortal.portalId)
                                o portalCounter - 1 si pendingPortal aún no tiene portalId (aunque debería tenerlo).
                                Lo más seguro es usar pendingPortal.portalId si existe.
                            */}
                            Haz clic para establecer el destino del portal {pendingPortal?.portalId !== undefined ? pendingPortal.portalId : portalCounter -1 }, o clic derecho / Esc para cancelar.
                        </div>
                    )}
                </EditorCanvas>

                <ElementsSidebar
                    selectedElement={selectedElement}
                    onSelectElement={handleSelectElement}
                    platformSize={platformSize}
                    onPlatformSizeChange={setPlatformSize}
                    $isInverted={isInverted}
                />
            </div> {/* Cierre del div que contiene EditorCanvas y ElementsSidebar */}

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

export default LevelEditor;
