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
import { useCanvasTransform } from './hooks/useCanvasTransform';
import { useLevelManager } from './hooks/useLevelManager';
import { useEditorModeManager } from './hooks/useEditorModeManager';
import { getActiveColor, getInactiveColor } from '../../utils/colors';
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';

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
        portalCounter,
        setPortalCounter,
        handleSave,
        handleSaveConfirm,
        handleExport,
        handleImport,
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
        const tolerance = 5 / zoomLevel;

        const isPointInElement = (point, element, defaultSize) => {
            const elX = element.x;
            const elWidth = element.width ?? defaultSize?.width ?? 40;
            const elHeight = element.height ?? defaultSize?.height ?? 40;
            let elY = element.y;
            if (element instanceof Spike || element.type === 'spike') {
                elY = element.y - elHeight;
            }
            return (point.x >= elX - tolerance &&
                point.x <= elX + elWidth + tolerance &&
                point.y >= elY - tolerance &&
                point.y <= elY + elHeight + tolerance);
        };

        let changed = false;
        const updatedPlatforms = level.platforms.filter(p => !isPointInElement({ x, y }, p));
        if (updatedPlatforms.length !== level.platforms.length) changed = true;

        const updatedObstacles = level.obstacles.filter(o => !isPointInElement({ x, y }, o, { width: Spike.defaultWidth, height: Spike.defaultHeight }));
        if (updatedObstacles.length !== level.obstacles.length) changed = true;

        const updatedTrampolines = level.trampolines.filter(t => !isPointInElement({ x, y }, t, { width: Trampoline.defaultWidth, height: Trampoline.defaultHeight }));
        if (updatedTrampolines.length !== level.trampolines.length) changed = true;

        const updatedPortals = level.portals.filter(p => {
            const entryMatch = isPointInElement({ x, y }, p, { width: p.width || 40, height: p.height || 60 });
            const destMatch = p.destination && isPointInElement({ x, y }, { x: p.destination.x, y: p.destination.y }, { width: 20, height: 20 });
            return !entryMatch && !destMatch;
        });
        if (updatedPortals.length !== level.portals.length) changed = true;

        const updatedLevel = { ...level };
        if (level.playerStart && isPointInElement({ x, y }, level.playerStart, { width: 40, height: 40 })) {
            updatedLevel.playerStart = { x: 50, y: LOGICAL_LEVEL_HEIGHT - 100 };
            changed = true;
        }
        if (level.goal && isPointInElement({ x, y }, level.goal, { width: Goal.defaultWidth, height: Goal.defaultHeight })) {
            updatedLevel.goal = new Goal({ x: LOGICAL_LEVEL_WIDTH - 100, y: LOGICAL_LEVEL_HEIGHT - 100 });
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
    }, [level, zoomLevel, setLevel, setHasUnsavedChanges]);

    const handleCanvasClick = useCallback((e) => {
        if (editorMode === 'pan' || e.button !== 0) return;
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
                    const finalPortal = new Portal({ ...pendingPortal, destination: { x: logicalX, y: logicalY }, portalId: portalCounter });
                    nextLevelState.portals = [...nextLevelState.portals, finalPortal];
                    setIsSelectingPortalDestination(false);
                    setPendingPortal(null);
                    setPortalCounter(prev => prev + 1);
                    changeMade = true;
                } else {
                    const newPortalBase = { x: logicalX, y: logicalY, color: elementColor, width: 40, height: 60, portalId: portalCounter };
                    setPendingPortal(newPortalBase);
                    setIsSelectingPortalDestination(true);
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

        if (changeMade) {
            setLevel(nextLevelState);
            setHasUnsavedChanges(true);
        }

        if (selectedElement === 'portal' && isSelectingPortalDestination) {
            setPreviewElement(null);
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
        } else if (editorMode === 'place' || editorMode === 'erase') {
            handlePanModeToggle();
        }
    }, [isSelectingPortalDestination, editorMode, handlePanModeToggle, setIsSelectingPortalDestination, setPendingPortal, setPreviewElement]);

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
        const elementColor = getActiveColor(isInverted);
        let newPreviewElement = null;
        const previewX = logicalX;
        const previewY = logicalY;

        switch (selectedElement) {
            case 'platform': newPreviewElement = { type: 'platform', x: previewX, y: previewY, width: platformSize.width, height: platformSize.height, color: elementColor }; break;
            case 'spike': newPreviewElement = { type: 'spike', x: previewX, y: previewY, width: Spike.defaultWidth, height: Spike.defaultHeight, color: elementColor }; break;
            case 'trampoline': newPreviewElement = { type: 'trampoline', x: previewX, y: previewY, width: Trampoline.defaultWidth, height: Trampoline.defaultHeight, color: elementColor }; break;
            case 'portal': newPreviewElement = { type: 'portal', x: previewX, y: previewY, width: 40, height: 60, color: 'purple' }; break;
            case 'goal': newPreviewElement = { type: 'goal', x: previewX, y: previewY, width: Goal.defaultWidth, height: Goal.defaultHeight }; break;
            case 'player-start': newPreviewElement = { type: 'player-start', x: previewX, y: previewY, width: 40, height: 40, color: elementColor }; break;
            default: break;
        }

        if (JSON.stringify(previewElement) !== JSON.stringify(newPreviewElement)) {
            setPreviewElement(newPreviewElement);
        }
    }, [
        editorMode, selectedElement, isSelectingPortalDestination, isInverted,
        platformSize, getLogicalCoords, previewElement, isPanning,
        setPreviewElement
    ]);

    const handlePointerMove = useCallback((e) => {
        const isTouchEvent = e.type.startsWith('touch');
        const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

        if (editorMode === 'pan' && isPanning) {
            panMove(clientX, clientY, e);
        } else if (!isTouchEvent) {
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
        setHasUnsavedChanges(false);
        setIsExitConfirmModalOpen(false);
        navigate('/user-levels');
    }, [navigate, setHasUnsavedChanges]);

    const handleCancelExit = useCallback(() => {
        setIsExitConfirmModalOpen(false);
    }, []);

    if (!level) {
        return <div>Cargando editor...</div>;
    }

    const oppositeColor = getInactiveColor(isInverted);
    const currentColor = getActiveColor(isInverted);

    const getPreviewStyle = (element) => {
        if (!element) return {};
        const style = {
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            opacity: 0.5,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            transformOrigin: 'top left',
            willChange: 'transform, opacity',
        };
        switch (element.type) {
            case 'platform':
                style.backgroundColor = element.color;
                style.border = `1px dashed ${element.color === 'black' ? 'white' : 'black'}`;
                break;
            case 'spike':
                style.top = `${element.y - element.height}px`;
                style.width = '0';
                style.height = '0';
                style.borderLeft = `${element.width / 2}px solid transparent`;
                style.borderRight = `${element.width / 2}px solid transparent`;
                style.borderBottom = `${element.height}px solid ${element.color}`;
                break;
            case 'trampoline':
                style.backgroundColor = element.color;
                style.border = `1px dashed ${element.color === 'black' ? 'white' : 'black'}`;
                style.borderRadius = '50% 50% 0 0';
                break;
            case 'portal':
                style.backgroundColor = 'purple';
                style.border = '2px dashed white';
                style.borderRadius = '8px';
                break;
            case 'goal':
                style.border = `2px dashed ${currentColor}`;
                style.borderRadius = '50%';
                break;
            case 'player-start':
                style.backgroundColor = element.color;
                style.border = `1px dashed ${element.color === 'black' ? 'white' : 'black'}`;
                break;
            default: break;
        }
        return style;
    };

    return (
        <EditorContainer isInverted={isInverted}>
            <LevelNameDisplayEdit
                levelName={levelName}
                onLevelNameChange={(e) => setLevelName(e.target.value)}
                onLevelNameSave={handleNameInputBlur}
                isEditing={isEditingName}
                setIsEditing={setIsEditingName}
                isInverted={isInverted}
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
                    onTouchStart={(e) => panStart(e.touches[0].clientX, e.touches[0].clientY)}
                    onTouchMove={handlePointerMove}
                    onTouchEnd={panEnd}
                    isInverted={isInverted}
                    editorMode={editorMode}
                    isDragging={isPanning}
                >
                    <LevelContentWrapper
                        ref={contentWrapperRef}
                        logicalWidth={LOGICAL_LEVEL_WIDTH}
                        logicalHeight={LOGICAL_LEVEL_HEIGHT}
                        isInverted={isInverted}
                        style={{
                            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoomLevel})`,
                            transformOrigin: 'top left'
                        }}
                    >
                        {level.platforms.map((platform, index) => (
                            <div
                                key={`platform-${index}`}
                                style={{
                                    position: 'absolute',
                                    left: platform.x,
                                    top: platform.y,
                                    width: platform.width,
                                    height: platform.height,
                                    backgroundColor: platform.color === currentColor ? platform.color : 'transparent',
                                    border: `1px solid ${platform.color === 'black' ? 'white' : 'black'}`,
                                    boxSizing: 'border-box'
                                }}
                            />
                        ))}
                        {level.obstacles.map((obstacle, index) => (
                            <div
                                key={`obstacle-${index}`}
                                style={{
                                    position: 'absolute',
                                    left: obstacle.x,
                                    top: obstacle.y - obstacle.height,
                                    width: 0,
                                    height: 0,
                                    borderLeft: `${obstacle.width / 2}px solid transparent`,
                                    borderRight: `${obstacle.width / 2}px solid transparent`,
                                    borderBottom: `${obstacle.height}px solid ${obstacle.color}`,
                                    opacity: obstacle.color === currentColor ? 1 : 0.3,
                                    filter: `drop-shadow(0px 0px 1px ${obstacle.color === 'black' ? 'white' : 'black'})`
                                }}
                            />
                        ))}
                        {level.trampolines.map((trampoline, index) => (
                            <div
                                key={`trampoline-${index}`}
                                style={{
                                    position: 'absolute',
                                    left: trampoline.x,
                                    top: trampoline.y,
                                    width: trampoline.width,
                                    height: trampoline.height,
                                    backgroundColor: trampoline.color === currentColor ? trampoline.color : 'transparent',
                                    border: `1px solid ${trampoline.color === 'black' ? 'white' : 'black'}`,
                                    borderRadius: '50% 50% 0 0',
                                    opacity: trampoline.color === currentColor ? 1 : 0.3
                                }}
                            />
                        ))}
                        {level.portals.map((portal, index) => (
                            <React.Fragment key={`portal-${index}`}>
                                <div
                                    style={{
                                        position: 'absolute',
                                        left: portal.x,
                                        top: portal.y,
                                        width: portal.width,
                                        height: portal.height,
                                        backgroundColor: 'purple',
                                        border: '1px solid white',
                                        opacity: 0.8,
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: 'white',
                                        fontSize: `${portal.width * 0.5}px`,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {portal.portalId}
                                </div>
                                {portal.destination && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            left: portal.destination.x,
                                            top: portal.destination.y,
                                            width: 20,
                                            height: 20,
                                            border: '2px dashed purple',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            opacity: 0.6,
                                            color: 'purple',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                    >
                                        {portal.portalId}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        {level.goal && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: level.goal.x,
                                    top: level.goal.y,
                                    width: level.goal.width,
                                    height: level.goal.height,
                                    border: `3px dashed ${currentColor}`,
                                    borderRadius: '50%'
                                }}
                            />
                        )}
                        {level.playerStart && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: level.playerStart.x,
                                    top: level.playerStart.y,
                                    width: 40,
                                    height: 40,
                                    backgroundColor: currentColor,
                                    opacity: 0.7
                                }}
                            />
                        )}
                        {pendingPortal && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: pendingPortal.x,
                                    top: pendingPortal.y,
                                    width: pendingPortal.width,
                                    height: pendingPortal.height,
                                    backgroundColor: 'purple',
                                    border: '1px solid white',
                                    opacity: 0.8,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: 'white',
                                    fontSize: `${pendingPortal.width * 0.5}px`,
                                    fontWeight: 'bold'
                                }}
                            >
                                {pendingPortal.portalId}
                            </div>
                        )}
                        {previewElement && <div style={getPreviewStyle(previewElement)} />}
                    </LevelContentWrapper>

                    <CanvasZoomControls
                        onZoomIn={zoomIn}
                        onZoomOut={zoomOut}
                        onTogglePanMode={handlePanModeToggle}
                        isPanModeActive={editorMode === 'pan'}
                        isInverted={isInverted}
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
                                zIndex: 50,
                                opacity: 0.9,
                                fontSize: '14px',
                                pointerEvents: 'none'
                            }}
                        >
                            Haz clic para establecer el destino del portal {portalCounter}, o clic derecho / Esc para cancelar.
                        </div>
                    )}
                </EditorCanvas>

                <ElementsSidebar
                    selectedElement={selectedElement}
                    editorMode={editorMode}
                    onSelectElement={handleSelectElement}
                    platformSize={platformSize}
                    onPlatformSizeChange={setPlatformSize}
                    isInverted={isInverted}
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
        </EditorContainer>
    );
};

export default LevelEditor;
