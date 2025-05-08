// --- START OF FILE LevelEditor.jsx ---

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal/ConfirmationModal';
import BackArrow from '../common/BackArrow/BackArrow';
import { useInversion } from '../../context/InversionContext';
import {
    EditorContainer, EditorSidebar, EditorCanvas, SidebarTitle, ElementsContainer,
    ElementButton, EditorToolbar, ToolbarItem, SaveDialog, SaveDialogContent, Input,
    SaveDialogButtons, ToolbarGroup, LevelContentWrapper, ZoomControls, ZoomButton,
} from './LevelEditor.styles';
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';
import { getUserLevelById, saveUserLevel, createEmptyLevel } from '../../utils/levelManager';
import { getActiveColor, getInactiveColor } from '../../utils/colors';
import { FaHandPaper } from 'react-icons/fa';
import { LevelEncoder } from '../../utils/levelEncoder';
import LevelNameDisplayEdit from './LevelNameDisplayEdit';
import Toolbar from './Toolbar';
import ElementsSidebar from './ElementsSidebar';
import CanvasZoomControls from './CanvasZoomControls';
import SaveLevelDialog from './SaveLevelDialog';

// Constantes
const LOGICAL_LEVEL_WIDTH = 1200;
const LOGICAL_LEVEL_HEIGHT = 800;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 3.0;
const ZOOM_STEP = 1.2;

const LevelEditor = () => {
    // Estados
    const { levelId } = useParams();
    const navigate = useNavigate();
    const { isInverted, toggleInversion } = useInversion();
    const [level, setLevel] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [editorMode, setEditorMode] = useState('place');
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [levelName, setLevelName] = useState('');
    const [eKeyPressed, setEKeyPressed] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [platformSize, setPlatformSize] = useState({ width: 100, height: 20 });
    const [isSelectingPortalDestination, setIsSelectingPortalDestination] = useState(false);
    const [pendingPortal, setPendingPortal] = useState(null);
    const [portalCounter, setPortalCounter] = useState(1);
    const [previewElement, setPreviewElement] = useState(null);
    const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
    const isDraggingCanvas = useRef(false);
    const dragStartCoords = useRef({ x: 0, y: 0 });
    const initialViewOffset = useRef({ x: 0, y: 0 });
    const [previousEditorMode, setPreviousEditorMode] = useState('place'); // Store mode before pan
    const [isEditingName, setIsEditingName] = useState(false); // Nuevo estado para edición de nombre
    const inputRef = useRef(null); // Ref para el input de nombre

    // Refs
    const canvasRef = useRef(null);
    const contentWrapperRef = useRef(null);

    // Handler para guardar el nombre al salir del input o pulsar Enter
    const handleNameInputBlur = useCallback(() => {
        if (levelName.trim() && levelName !== level?.name) {
            setLevel(prev => ({ ...prev, name: levelName.trim() }));
            setHasUnsavedChanges(true);
        }
    }, [levelName, level]);

    const handleNameInputKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            // handleNameInputBlur(); // Lógica ahora en LevelNameDisplayEdit y onLevelNameSave
        } else if (e.key === 'Escape') {
            // setIsEditingName(false); // Esto ahora lo maneja LevelNameDisplayEdit
            // setLevelName(level?.name || ''); // Esto podría manejarse si Escape debe revertir
        }
    }, [level]); // Removido handleNameInputBlur de dependencias

    // --- Funciones de Zoom ---
    const handleZoomIn = useCallback(() => setZoomLevel(prev => Math.min(MAX_ZOOM, prev * ZOOM_STEP)), []);
    const handleZoomOut = useCallback(() => setZoomLevel(prev => Math.max(MIN_ZOOM, prev / ZOOM_STEP)), []);

    // --- Toggle Modo Pan ---
    const handlePanModeToggle = useCallback(() => {
        setEditorMode(prevMode => {
            if (prevMode === 'pan') {
                // Return to the mode that was active before panning
                return previousEditorMode || 'place';
            } else {
                // Store the current mode before switching to pan
                setPreviousEditorMode(prevMode);
                setSelectedElement(null); // Clear selection when entering pan mode
                setPreviewElement(null); // Clear preview
                return 'pan';
            }
        });
        // Explicitly reset dragging state in case it got stuck
        isDraggingCanvas.current = false;
    }, [previousEditorMode]); // Depend on previousEditorMode


    // --- Efectos ---
    useEffect(() => { // ResizeObserver
        const canvasElement = canvasRef.current; if (!canvasElement) return;
        const resizeObserver = new ResizeObserver(entries => { entries.forEach(entry => setCanvasSize(entry.contentRect)); });
        resizeObserver.observe(canvasElement);
        setCanvasSize(canvasElement.getBoundingClientRect()); // Tamaño inicial
        return () => { if (canvasElement) resizeObserver.unobserve(canvasElement); };
    }, []);

    useEffect(() => { // Zoom y Offset Inicial/Fit
        if (canvasSize.width > 0 && canvasSize.height > 0) {
            const scaleX = canvasSize.width / LOGICAL_LEVEL_WIDTH;
            const scaleY = canvasSize.height / LOGICAL_LEVEL_HEIGHT;
            const fitScale = Math.min(scaleX, scaleY) * 0.95;
            const clampedZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, fitScale));
            setZoomLevel(clampedZoom);
            const offsetX = (canvasSize.width - LOGICAL_LEVEL_WIDTH * clampedZoom) / 2;
            const offsetY = (canvasSize.height - LOGICAL_LEVEL_HEIGHT * clampedZoom) / 2;
            setViewOffset({ x: offsetX, y: offsetY });
        }
    }, [canvasSize]);

    useEffect(() => { // Teclas
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                if (saveDialogOpen) { setSaveDialogOpen(false); return; }
                if (isExitConfirmModalOpen) { setIsExitConfirmModalOpen(false); return; }
                if (isSelectingPortalDestination) { setIsSelectingPortalDestination(false); setPendingPortal(null); return; }
                // If in pan mode, switch back to previous mode instead of just 'place'
                if (editorMode === 'pan') { setEditorMode(previousEditorMode || 'place'); return; }
                 setSelectedElement(null); // Deselect element on Escape if not panning
                 setPreviewElement(null);
            }
            if (e.key.toLowerCase() === 'e' && !eKeyPressed && !saveDialogOpen && !isExitConfirmModalOpen && document.activeElement?.tagName !== 'INPUT') {
                setEKeyPressed(true); toggleInversion();
            }
            // Prevent zoom/pan actions if an input/modal is active
            if (document.activeElement?.tagName !== 'INPUT' && !saveDialogOpen && !isExitConfirmModalOpen) {
                if (e.key === '+' || e.key === '=') { handleZoomIn(); e.preventDefault(); }
                if (e.key === '-' || e.key === '_') { handleZoomOut(); e.preventDefault(); }
                if (e.key === ' ') {
                    e.preventDefault(); handlePanModeToggle();
                }
            }
        };
        const handleKeyUp = (e) => { if (e.key.toLowerCase() === 'e') { setEKeyPressed(false); } };
        window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
        return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
    }, [toggleInversion, eKeyPressed, saveDialogOpen, isExitConfirmModalOpen, isSelectingPortalDestination, editorMode, handleZoomIn, handleZoomOut, handlePanModeToggle, previousEditorMode]);

    useEffect(() => { // Cargar Nivel
        let levelData;
        if (levelId === 'new') {
            levelData = createEmptyLevel();
        } else {
            levelData = getUserLevelById(levelId);
        }
        if (levelData) {
            const reconstructedLevel = {
                ...levelData,
                platforms: (levelData.platforms || []).map(p => p instanceof Platform ? p : new Platform(p)),
                obstacles: (levelData.obstacles || []).map(o => o instanceof Spike ? o : new Spike(o)),
                trampolines: (levelData.trampolines || []).map(t => t instanceof Trampoline ? t : new Trampoline(t)),
                portals: (levelData.portals || []).map(p => p instanceof Portal ? p : new Portal(p)),
                goal: levelData.goal instanceof Goal ? levelData.goal : new Goal(levelData.goal || { x: LOGICAL_LEVEL_WIDTH - 100, y: LOGICAL_LEVEL_HEIGHT - 100 })
            };
            setLevel(reconstructedLevel);
            setHasUnsavedChanges(false);
            setLevelName(reconstructedLevel.name || '');
            const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0));
            setPortalCounter(maxPortalId + 1);
        } else if (levelId !== 'new') {
            console.error(`Nivel con ID ${levelId} no encontrado.`);
            navigate('/user-levels');
        }
    }, [levelId, navigate]);

    useEffect(() => { // BeforeUnload
        if (!hasUnsavedChanges) return;
        const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = 'Hay cambios sin guardar.'; return e.returnValue; };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    useEffect(() => {
        if (isEditingName && inputRef.current) {
            // inputRef.current.focus(); // Lógica ahora en LevelNameDisplayEdit
            // inputRef.current.select(); // Lógica ahora en LevelNameDisplayEdit
        }
    }, [isEditingName]);

    // --- Coordenadas Lógicas ---
    const getLogicalCoords = useCallback((clientX, clientY) => {
        if (!contentWrapperRef.current || !canvasRef.current) return { x: 0, y: 0 };
        const canvasRect = canvasRef.current.getBoundingClientRect();
        // Calculate mouse position relative to the canvas top-left corner
        const mouseXCanvas = clientX - canvasRect.left;
        const mouseYCanvas = clientY - canvasRect.top;
        // Adjust for the current view offset and zoom level
        const logicalX = (mouseXCanvas - viewOffset.x) / zoomLevel;
        const logicalY = (mouseYCanvas - viewOffset.y) / zoomLevel;
        // Return unrounded coordinates for smoother preview and accurate placement
         return { x: logicalX, y: logicalY };
    }, [zoomLevel, viewOffset]);

    // --- Lógica Unificada de Arrastre (Pan) ---
    const handleDragStart = useCallback((clientX, clientY) => {
        if (editorMode !== 'pan') return;
        isDraggingCanvas.current = true;
        dragStartCoords.current = { x: clientX, y: clientY };
        initialViewOffset.current = { ...viewOffset };
        // Cursor style is handled by styled-components based on isDragging prop
    }, [editorMode, viewOffset]);

    const handleDragMove = useCallback((clientX, clientY, event) => {
        if (editorMode !== 'pan' || !isDraggingCanvas.current) return;
        if (event && event.type === 'touchmove') { event.preventDefault(); } // Prevent page scroll on touch
        const currentX = clientX; const currentY = clientY;
        const deltaX = currentX - dragStartCoords.current.x;
        const deltaY = currentY - dragStartCoords.current.y;
        setViewOffset({ x: initialViewOffset.current.x + deltaX, y: initialViewOffset.current.y + deltaY });
    }, [editorMode]);

    const handleDragEnd = useCallback(() => {
        // Only reset dragging state if we were actually dragging
        if (isDraggingCanvas.current) {
            isDraggingCanvas.current = false;
        }
        // Cursor style will automatically update via styled-components when isDragging becomes false
    }, []);


    // --- Lógica Colocar/Borrar ---
    const eraseElementAt = useCallback((logicalX, logicalY) => { // Use logical coords directly
        if (!level) return;
        const x = logicalX; // Use unrounded logical coords for checks
        const y = logicalY;

        // Increased tolerance slightly for easier deletion, especially of thin elements
        const tolerance = 5 / zoomLevel; // 5 screen pixels tolerance, adjusted for zoom

        const isPointInElement = (point, element, defaultSize) => {
            const elX = element.x;
            const elWidth = element.width ?? defaultSize?.width ?? 40;
            const elHeight = element.height ?? defaultSize?.height ?? 40;
            let elY = element.y;

            // Adjust bounding box for Spikes (origin is base)
            if (element instanceof Spike || element.type === 'spike') {
                elY = element.y - elHeight; // Top of the spike
            }

            // Check with tolerance
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

        // Check both portal entry and destination (if exists)
        const updatedPortals = level.portals.filter(p => {
            const entryMatch = isPointInElement({ x, y }, p, { width: p.width || 40, height: p.height || 60 });
            // Use isPointInElement for destination marker as well for consistency
            const destMatch = p.destination && isPointInElement({ x, y }, { x: p.destination.x, y: p.destination.y }, { width: 20, height: 20 }); // Assuming marker size is 20x20

            return !entryMatch && !destMatch;
        });
        if (updatedPortals.length !== level.portals.length) changed = true;

        const updatedLevel = { ...level };
        if (level.playerStart && isPointInElement({ x, y }, level.playerStart, { width: 40, height: 40 })) { updatedLevel.playerStart = { x: 50, y: LOGICAL_LEVEL_HEIGHT - 100 }; changed = true; }
        if (level.goal && isPointInElement({ x, y }, level.goal, { width: Goal.defaultWidth, height: Goal.defaultHeight })) { updatedLevel.goal = new Goal({ x: LOGICAL_LEVEL_WIDTH - 100, y: LOGICAL_LEVEL_HEIGHT - 100 }); changed = true; }

        if (changed) {
            updatedLevel.platforms = updatedPlatforms; updatedLevel.obstacles = updatedObstacles; updatedLevel.trampolines = updatedTrampolines; updatedLevel.portals = updatedPortals;
            setLevel(updatedLevel); setHasUnsavedChanges(true);
        }
    }, [level, zoomLevel]); // Added zoomLevel dependency for tolerance calc

    // --- Event Handlers del Canvas ---
    const handleCanvasClick = useCallback((e) => {
        if (editorMode === 'pan' || e.button !== 0) return; // Ignore pan mode and non-left clicks

        // Use unrounded logical coordinates for accuracy in placement and deletion
        const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);

        if (editorMode === 'erase') {
            eraseElementAt(logicalX, logicalY); // Use unrounded logical coords for erasing check
            return; // Don't place anything if erasing
        }

        // Only proceed if in 'place' mode and an element is selected
        if (editorMode !== 'place' || !selectedElement || !level) return;

        const elementColor = getActiveColor(isInverted); let newElement; let changeMade = false;
        switch (selectedElement) {
            // *** CORRECTION: Place elements using unrounded logical coordinates (logicalX, logicalY) ***
            case 'platform': newElement = new Platform({ x: logicalX, y: logicalY, color: elementColor, width: platformSize.width, height: platformSize.height }); setLevel(prev => ({ ...prev, platforms: [...prev.platforms, newElement] })); changeMade = true; break;
            case 'spike': newElement = new Spike({ x: logicalX, y: logicalY, color: elementColor }); setLevel(prev => ({ ...prev, obstacles: [...prev.obstacles, newElement] })); changeMade = true; break; // Spike's y is its base
            case 'trampoline': newElement = new Trampoline({ x: logicalX, y: logicalY, color: elementColor }); setLevel(prev => ({ ...prev, trampolines: [...prev.trampolines, newElement] })); changeMade = true; break;
            case 'portal':
                if (isSelectingPortalDestination && pendingPortal) {
                    // Use logicalX/Y for destination
                    const finalPortal = new Portal({ ...pendingPortal, destination: { x: logicalX, y: logicalY }, portalId: portalCounter });
                    setLevel(prev => ({ ...prev, portals: [...prev.portals, finalPortal] }));
                    setIsSelectingPortalDestination(false); setPendingPortal(null); setPortalCounter(prev => prev + 1); changeMade = true;
                } else {
                    // Use logicalX/Y for entry
                    const newPortalBase = { x: logicalX, y: logicalY, color: elementColor, width: 40, height: 60, portalId: portalCounter };
                    setPendingPortal(newPortalBase); setIsSelectingPortalDestination(true);
                }
                break;
            case 'goal': newElement = new Goal({ x: logicalX, y: logicalY }); setLevel(prev => ({ ...prev, goal: newElement })); changeMade = true; break;
            case 'player-start': setLevel(prev => ({ ...prev, playerStart: { x: logicalX, y: logicalY } })); changeMade = true; break;
            default: break;
        }
        if (changeMade) { setHasUnsavedChanges(true); }
        // Keep preview active unless selecting portal destination
        if (selectedElement !== 'portal' || !isSelectingPortalDestination) {
           // Re-trigger preview update in case element properties (like platform size) affect it
           // This is implicitly handled by handlePointerMove if mouse moves slightly after click
        } else {
             setPreviewElement(null); // Hide preview while selecting destination
        }

    }, [level, editorMode, selectedElement, isInverted, platformSize, isSelectingPortalDestination, pendingPortal, portalCounter, getLogicalCoords, eraseElementAt]);

    const handleCanvasContextMenu = useCallback((e) => {
        e.preventDefault();
        if (isSelectingPortalDestination) {
            setIsSelectingPortalDestination(false); setPendingPortal(null);
            setPreviewElement(null); // Ensure preview is cleared on cancel
        } else if (editorMode === 'place' || editorMode === 'erase') {
            // Deselect element or switch to pan on right click (optional)
            //setSelectedElement(null);
            //setPreviewElement(null);
             handlePanModeToggle(); // Switch to pan mode on right click
        }
    }, [isSelectingPortalDestination, editorMode, handlePanModeToggle]); // Added handlePanModeToggle

    const handleCanvasMouseLeave = useCallback(() => {
        setPreviewElement(null);
        // Also handle drag end if mouse leaves while dragging
        if (isDraggingCanvas.current) {
            handleDragEnd();
        }
    }, [handleDragEnd]);

    const handleCanvasMouseMoveForPreview = useCallback((e) => {
        // Don't show preview if panning, erasing, selecting portal destination, or dragging canvas
        if (editorMode === 'pan' || editorMode === 'erase' || !selectedElement || isSelectingPortalDestination || !contentWrapperRef.current || isDraggingCanvas.current) {
            if (previewElement) setPreviewElement(null); // Clear preview if it exists
            return;
        }

        // Use unrounded logical coordinates for smooth preview positioning
        const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);

        const elementColor = getActiveColor(isInverted); let newPreviewElement = null;
        // Use logicalX/Y directly for preview position
        const previewX = logicalX;
        const previewY = logicalY;

        switch (selectedElement) {
            case 'platform': newPreviewElement = { type: 'platform', x: previewX, y: previewY, width: platformSize.width, height: platformSize.height, color: elementColor }; break;
            case 'spike': newPreviewElement = { type: 'spike', x: previewX, y: previewY, width: Spike.defaultWidth, height: Spike.defaultHeight, color: elementColor }; break; // y is base
            case 'trampoline': newPreviewElement = { type: 'trampoline', x: previewX, y: previewY, width: Trampoline.defaultWidth, height: Trampoline.defaultHeight, color: elementColor }; break;
            case 'portal': newPreviewElement = { type: 'portal', x: previewX, y: previewY, width: 40, height: 60, color: 'purple' }; break;
            case 'goal': newPreviewElement = { type: 'goal', x: previewX, y: previewY, width: Goal.defaultWidth, height: Goal.defaultHeight }; break;
            case 'player-start': newPreviewElement = { type: 'player-start', x: previewX, y: previewY, width: 40, height: 40, color: elementColor }; break;
            default: break;
        }

        // Update preview state only if it changed (simple optimization)
        if (JSON.stringify(previewElement) !== JSON.stringify(newPreviewElement)) {
            setPreviewElement(newPreviewElement);
        }

    }, [editorMode, selectedElement, isSelectingPortalDestination, isInverted, platformSize, getLogicalCoords, previewElement]);

    const handlePointerMove = useCallback((e) => {
        const isTouchEvent = e.type.startsWith('touch');
        const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;

        if (editorMode === 'pan' && isDraggingCanvas.current) {
            handleDragMove(clientX, clientY, e);
        } else if (!isTouchEvent) { // Only update preview on mouse move (not touch move to avoid potential performance issues)
            handleCanvasMouseMoveForPreview(e);
        }
    }, [editorMode, handleDragMove, handleCanvasMouseMoveForPreview, isDraggingCanvas]); // Added isDraggingCanvas dependency


    // --- Funciones Guardar/Exportar/Importar/Salir ---
    const handleSave = useCallback(() => {
        if (!level) return;
        const effectiveName = levelName.trim() || level.name;
        if (!effectiveName || effectiveName === 'Untitled Level') {
            setLevelName(effectiveName === 'Untitled Level' ? '' : effectiveName || '');
            setSaveDialogOpen(true);
            return;
        }
        const levelToSave = { ...level, name: effectiveName };
        const savedLevelId = saveUserLevel(levelToSave, levelId === 'new' ? null : levelId);
        if (savedLevelId) {
            setHasUnsavedChanges(false);
            setLevel(levelToSave);
            if (levelId === 'new') {
                navigate(`/level-editor/${savedLevelId}`, { replace: true });
            }
        } else {
            alert("Error al guardar el nivel existente.");
        }
    }, [level, levelId, levelName, navigate]);

    const handleSaveConfirm = useCallback(() => {
        if (!level || !levelName.trim()) { alert("Por favor, introduce un nombre válido para el nivel.");
             return; 
        }
        const levelToSave = { ...level, name: levelName.trim() };
        const idToSaveUnder = levelId === 'new' ? null : levelId;
        const savedLevelId = saveUserLevel(levelToSave, idToSaveUnder);
        if (savedLevelId) {
            setSaveDialogOpen(false);
            setHasUnsavedChanges(false);
            if (levelId === 'new') {
                // Navigate to the editor page with the new ID, replacing history
                navigate(`/level-editor/${savedLevelId}`, { replace: true });
            } else {
                // Update local level state if name changed
                 setLevel(levelToSave);
            }
        } else {
            alert("Error al guardar el nivel.");
        } 
    }, [level, levelName, levelId, navigate]);

    const handleExport = useCallback(() => {
        if (!level) return;
        
        const finalLevelName = levelName || level.name || 'untitled-level';
        const levelToExport = {
            ...level,
            name: finalLevelName
        };
    
        // Eliminar IDs temporales de niveles importados
        const cleanedLevel = JSON.parse(
            JSON.stringify(levelToExport, (key, value) => 
                (key === 'id' && value?.startsWith && value.startsWith('imported_')) ? undefined : value
            )
        );
    
        // Codificar el nivel
        const encodedLevel = LevelEncoder.encode(cleanedLevel);
        if (!encodedLevel) {
            alert('Error al exportar el nivel');
            return;
        }
    
        // Mostrar un modal con el código
        const textArea = document.createElement('textarea');
        textArea.value = encodedLevel;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Código del nivel copiado al portapapeles:\n\n' + encodedLevel);
    }, [level, levelName]);
    
    const handleImport = useCallback(() => {
        const code = prompt('Pega el código del nivel:');
        if (!code) return;
    
        try {
            // Decodificar el contenido
            const importedLevel = LevelEncoder.decode(code);
            
            if (!importedLevel || typeof importedLevel.playerStart !== 'object' || typeof importedLevel.goal !== 'object') {
                throw new Error("Estructura del nivel inválida");
            }
    
            // Reconstruir el nivel con las clases correctas
            const reconstructedLevel = {
                ...createEmptyLevel(),
                ...importedLevel,
                id: levelId === 'new' ? `imported_${Date.now()}` : levelId,
                name: importedLevel.name || 'Nivel Importado',
                platforms: (importedLevel.platforms || []).map(p => new Platform(p)),
                obstacles: (importedLevel.obstacles || []).map(o => new Spike(o)),
                trampolines: (importedLevel.trampolines || []).map(t => new Trampoline(t)),
                portals: (importedLevel.portals || []).map(p => new Portal(p)),
                goal: new Goal(importedLevel.goal)
            };
    
            setLevel(reconstructedLevel);
            setHasUnsavedChanges(true);
            setLevelName(reconstructedLevel.name);
            
            // Actualizar contador de portales
            const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0));
            setPortalCounter(maxPortalId + 1);
            
            alert('Nivel importado con éxito. Recuerda guardarlo.');
        } catch (error) {
            console.error('Error al importar el nivel:', error);
            alert('Error al importar el nivel: El código no es válido.');
        }
    }, [levelId]);
    const handleGoBack = useCallback(() => { if (hasUnsavedChanges) { setIsExitConfirmModalOpen(true); } else { navigate('/user-levels'); } }, [hasUnsavedChanges, navigate]);
    const handleConfirmExit = useCallback(() => { setHasUnsavedChanges(false); setIsExitConfirmModalOpen(false); navigate('/user-levels'); }, [navigate]);
    const handleCancelExit = useCallback(() => { setIsExitConfirmModalOpen(false); }, []);

    // --- Seleccionar Elemento ---
    const handleSelectElement = useCallback((elementName) => {
        setSelectedElement(elementName);
        setEditorMode('place'); // Always switch to 'place' mode when selecting an element button
        setIsSelectingPortalDestination(false); // Reset portal selection state
        setPendingPortal(null);
         // Trigger a preview update immediately if mouse is over canvas
        // This requires knowing the last mouse position or simulating a move event.
        // Simpler: rely on subsequent mouse move to show preview.
    }, []);

    // --- Set Editor Mode Function ---
    const setMode = useCallback((newMode) => {
        setEditorMode(newMode);
        if (newMode === 'erase') {
            setSelectedElement(null); // Clear selection when choosing erase
            setPreviewElement(null);
        } else if (newMode === 'place') {
            // If switching to place and nothing is selected, default to platform
            if (!selectedElement) setSelectedElement('platform');
        } else if (newMode === 'pan') {
             // Pan mode toggle handles storing previous mode and clearing selection/preview
             setPreviewElement(null); // Ensure preview clears when entering pan mode
        }
    }, [selectedElement]); // Dependency on selectedElement for the default case


    // --- Renderizado ---
    if (!level) { return <div>Cargando editor...</div>; }
    const oppositeColor = getInactiveColor(isInverted);
    const currentColor = getActiveColor(isInverted);

    // Function to get style for preview elements (uses unrounded coords)
    // *** CORRECTION: Added transformOrigin and adjustments for better cursor alignment ***
    const getPreviewStyle = (element) => {
        if (!element) return {};

        // Base style uses direct logical coords for top-left
        const style = {
            position: 'absolute',
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.width}px`,
            height: `${element.height}px`,
            opacity: 0.5,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            transformOrigin: 'top left', // Ensure transformations are relative to the cursor point
            willChange: 'transform, opacity', // Perf hint
        };

        // Specific adjustments for different element types
        switch (element.type) {
            case 'platform':
                style.backgroundColor = element.color;
                style.border = `1px dashed ${element.color === 'black' ? 'white' : 'black'}`;
                break;
            case 'spike':
                 // Spike preview: position based on BASE y, render upwards graphically
                style.top = `${element.y - element.height}px`; // Adjust top for rendering
                style.width = '0'; // Use border trick for triangle
                style.height = '0';
                style.borderLeft = `${element.width / 2}px solid transparent`;
                style.borderRight = `${element.width / 2}px solid transparent`;
                style.borderBottom = `${element.height}px solid ${element.color}`;
                // No background needed for spike itself
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
            {/* Mostrar el nombre del nivel arriba del toolbar */}
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
                onSetMode={setMode} // Pasamos la función setMode directamente
                onToggleInversion={toggleInversion}
                onExportLevel={handleExport}
                onImportLevel={handleImport}
                onSaveLevel={handleSave}
                onGoBack={handleGoBack}
                hasUnsavedChanges={hasUnsavedChanges}
                isLevelLoaded={!!level} // `level` no es null/undefined
                isInverted={isInverted}
            />

            <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden', position: 'relative' }}> {/* Ensure relative positioning for children */}
                <EditorCanvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    onContextMenu={handleCanvasContextMenu}
                    onMouseMove={handlePointerMove} // Handles both drag move and preview move
                    onMouseDown={(e) => { if(e.button === 0) handleDragStart(e.clientX, e.clientY) }} // Pass coords for mouse left-click only
                    onMouseUp={handleDragEnd}
                    onMouseLeave={handleCanvasMouseLeave}
                    // Eventos Táctiles
                    onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)} // Pass coords for touch
                    onTouchMove={handlePointerMove}
                    onTouchEnd={handleDragEnd}
                    isInverted={isInverted}
                    editorMode={editorMode}
                    isDragging={isDraggingCanvas.current} // Pass dragging state for cursor styling
                >
                    <LevelContentWrapper
                        ref={contentWrapperRef}
                        logicalWidth={LOGICAL_LEVEL_WIDTH}
                        logicalHeight={LOGICAL_LEVEL_HEIGHT}
                        isInverted={isInverted}
                        style={{
                            transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoomLevel})`,
                            transformOrigin: 'top left' // Ensure transform origin is correct
                         }}
                    >
                        {/* Render Placed Elements */}
                        {level.platforms.map((platform, index) => (<div key={`platform-${index}`} style={{ position: 'absolute', left: platform.x, top: platform.y, width: platform.width, height: platform.height, backgroundColor: platform.color === currentColor ? platform.color : 'transparent', border: `1px solid ${platform.color === 'black' ? 'white' : 'black'}`, boxSizing: 'border-box' }} />))}
                        {level.obstacles.map((obstacle, index) => (<div key={`obstacle-${index}`} style={{ position: 'absolute', left: obstacle.x, top: obstacle.y - obstacle.height, /* Render spike based on base Y */ width: 0, height: 0, borderLeft: `${obstacle.width / 2}px solid transparent`, borderRight: `${obstacle.width / 2}px solid transparent`, borderBottom: `${obstacle.height}px solid ${obstacle.color}`, opacity: obstacle.color === currentColor ? 1 : 0.3, filter: `drop-shadow(0px 0px 1px ${obstacle.color === 'black' ? 'white' : 'black'})` }} />))}
                        {level.trampolines.map((trampoline, index) => (<div key={`trampoline-${index}`} style={{ position: 'absolute', left: trampoline.x, top: trampoline.y, width: trampoline.width, height: trampoline.height, backgroundColor: trampoline.color === currentColor ? trampoline.color : 'transparent', border: `1px solid ${trampoline.color === 'black' ? 'white' : 'black'}`, borderRadius: '50% 50% 0 0', opacity: trampoline.color === currentColor ? 1 : 0.3 }} />))}
                        {level.portals.map((portal, index) => (<React.Fragment key={`portal-${index}`}> <div style={{ position: 'absolute', left: portal.x, top: portal.y, width: portal.width, height: portal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${portal.width * 0.5}px`, fontWeight: 'bold' }}>{portal.portalId}</div> {portal.destination && (<div style={{ position: 'absolute', left: portal.destination.x, top: portal.destination.y, width: 20, height: 20, border: '2px dashed purple', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.6, color: 'purple', fontSize: '12px', fontWeight: 'bold', transform: 'translate(-50%, -50%)' /* Center marker */ }}>{portal.portalId}</div>)} </React.Fragment>))}
                        {level.goal && (<div style={{ position: 'absolute', left: level.goal.x, top: level.goal.y, width: level.goal.width, height: level.goal.height, border: `3px dashed ${currentColor}`, borderRadius: '50%' }} />)}
                        {level.playerStart && (<div style={{ position: 'absolute', left: level.playerStart.x, top: level.playerStart.y, width: 40, height: 40, backgroundColor: currentColor, opacity: 0.7 }} />)}
                        {pendingPortal && (<div style={{ position: 'absolute', left: pendingPortal.x, top: pendingPortal.y, width: pendingPortal.width, height: pendingPortal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${pendingPortal.width * 0.5}px`, fontWeight: 'bold' }}>{pendingPortal.portalId}</div>)}

                         {/* Preview Element - Rendered on top within the scaled container */}
                         {previewElement && <div style={getPreviewStyle(previewElement)} />}

                    </LevelContentWrapper>

                    {/* UI Elements outside the scaled container */}
                    <CanvasZoomControls 
                        onZoomIn={handleZoomIn}
                        onZoomOut={handleZoomOut}
                        onTogglePanMode={handlePanModeToggle}
                        isPanModeActive={editorMode === 'pan'}
                        isInverted={isInverted}
                    />

                    {isSelectingPortalDestination && (
                        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: getActiveColor(isInverted), color: getInactiveColor(isInverted), padding: '8px 15px', borderRadius: '5px', textAlign: 'center', zIndex: 50, opacity: 0.9, fontSize: '14px', pointerEvents: 'none' }}>
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

            {/* Modales */}
            <SaveLevelDialog 
                isOpen={saveDialogOpen}
                onClose={() => setSaveDialogOpen(false)}
                onConfirm={handleSaveConfirm}
                levelName={levelName}
                onLevelNameChange={(e) => setLevelName(e.target.value)}
                isInverted={isInverted}
            />
            <ConfirmationModal isOpen={isExitConfirmModalOpen} onClose={handleCancelExit} onConfirm={handleConfirmExit} message="¿Estás seguro de que quieres salir? Se perderán los cambios no guardados." isInverted={isInverted} />

        </EditorContainer>
    );
};

export default LevelEditor;
