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

  // Refs
  const canvasRef = useRef(null);
  const contentWrapperRef = useRef(null);

  // --- Funciones de Zoom ---
  const handleZoomIn = useCallback(() => setZoomLevel(prev => Math.min(MAX_ZOOM, prev * ZOOM_STEP)), []);
  const handleZoomOut = useCallback(() => setZoomLevel(prev => Math.max(MIN_ZOOM, prev / ZOOM_STEP)) , []);

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
        if (editorMode === 'pan') { setEditorMode('place'); return; }
      }
      if (e.key.toLowerCase() === 'e' && !eKeyPressed && !saveDialogOpen && !isExitConfirmModalOpen && document.activeElement?.tagName !== 'INPUT') {
        setEKeyPressed(true); toggleInversion();
      }
      // Prevent zoom actions if an input is focused
      if (document.activeElement?.tagName !== 'INPUT') {
        if (e.key === '+' || e.key === '=') { handleZoomIn(); e.preventDefault(); }
        if (e.key === '-' || e.key === '_') { handleZoomOut(); e.preventDefault(); }
        if (e.key === ' ' && document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault(); handlePanModeToggle();
        }
      }
    };
    const handleKeyUp = (e) => { if (e.key.toLowerCase() === 'e') { setEKeyPressed(false); } };
    window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [toggleInversion, eKeyPressed, saveDialogOpen, isExitConfirmModalOpen, isSelectingPortalDestination, editorMode, handleZoomIn, handleZoomOut, handlePanModeToggle]);

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

  // --- Coordenadas Lógicas ---
  const getLogicalCoords = useCallback((clientX, clientY) => {
    if (!contentWrapperRef.current || !canvasRef.current) return { x: 0, y: 0 };
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseXCanvas = clientX - canvasRect.left;
    const mouseYCanvas = clientY - canvasRect.top;
    const logicalX = (mouseXCanvas - viewOffset.x) / zoomLevel;
    const logicalY = (mouseYCanvas - viewOffset.y) / zoomLevel;
    return { x: logicalX, y: logicalY };
  }, [zoomLevel, viewOffset]);

  // --- Lógica Unificada de Arrastre (Pan) ---
  const handleDragStart = useCallback((clientX, clientY) => {
    if (editorMode !== 'pan') return;
    isDraggingCanvas.current = true;
    dragStartCoords.current = { x: clientX, y: clientY };
    initialViewOffset.current = { ...viewOffset };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
  }, [editorMode, viewOffset]);

  const handleDragMove = useCallback((clientX, clientY, event) => {
    if (editorMode !== 'pan' || !isDraggingCanvas.current) return;
    if (event && event.type === 'touchmove') { event.preventDefault(); }
    const currentX = clientX; const currentY = clientY;
    const deltaX = currentX - dragStartCoords.current.x;
    const deltaY = currentY - dragStartCoords.current.y;
    setViewOffset({ x: initialViewOffset.current.x + deltaX, y: initialViewOffset.current.y + deltaY });
  }, [editorMode]);

  const handleDragEnd = useCallback(() => {
    // Only reset cursor if we were actually dragging in pan mode
    if (editorMode === 'pan' && isDraggingCanvas.current) {
        isDraggingCanvas.current = false;
        if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
    }
    // General mouse up / touch end, might be needed for other modes eventually
    // but currently only relevant for pan dragging.
  }, [editorMode]);


  // --- Lógica Colocar/Borrar ---
  const eraseElementAt = useCallback((x, y) => {
      if (!level) return;
      const isPointInElement = (point, element, defaultSize) => {
          const width = element.width ?? defaultSize?.width ?? 40;
          const height = element.height ?? defaultSize?.height ?? 40;
          let elementY = element.y;
          // Special handling for spikes as their logical y is at the base
          if (element instanceof Spike || element.type === 'spike') {
              elementY = element.y - height; // Adjust y to top-left for check
          }
          return (point.x >= element.x && point.x <= element.x + width && point.y >= elementY && point.y <= elementY + height);
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
          const destMatch = p.destination && isPointInElement({ x, y }, p.destination, { width: 20, height: 20 }); // Approx size of dest marker
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
  }, [level]);

  // --- Event Handlers del Canvas ---
  const handleCanvasClick = useCallback((e) => {
      if (editorMode === 'pan' || e.button !== 0) return; // Ignore pan mode and non-left clicks
      const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);
      const x = Math.round(logicalX); const y = Math.round(logicalY);

      if (editorMode === 'erase') {
          eraseElementAt(x, y);
          return; // Don't place anything if erasing
      }

      // Only proceed if in 'place' mode and an element is selected
      if (editorMode !== 'place' || !selectedElement || !level) return;

      const elementColor = getActiveColor(isInverted); let newElement; let changeMade = false;
      switch (selectedElement) {
          case 'platform': newElement = new Platform({ x, y, color: elementColor, width: platformSize.width, height: platformSize.height }); setLevel(prev => ({ ...prev, platforms: [...prev.platforms, newElement] })); changeMade = true; break;
          case 'spike': newElement = new Spike({ x, y: y, color: elementColor }); setLevel(prev => ({ ...prev, obstacles: [...prev.obstacles, newElement] })); changeMade = true; break; // Note: y is base for Spike
          case 'trampoline': newElement = new Trampoline({ x, y, color: elementColor }); setLevel(prev => ({ ...prev, trampolines: [...prev.trampolines, newElement] })); changeMade = true; break;
          case 'portal': if (isSelectingPortalDestination && pendingPortal) { const finalPortal = new Portal({ ...pendingPortal, destination: { x, y }, portalId: portalCounter }); setLevel(prev => ({ ...prev, portals: [...prev.portals, finalPortal] })); setIsSelectingPortalDestination(false); setPendingPortal(null); setPortalCounter(prev => prev + 1); changeMade = true; } else { const newPortalBase = { x, y, color: elementColor, width: 40, height: 60, portalId: portalCounter }; setPendingPortal(newPortalBase); setIsSelectingPortalDestination(true); } break;
          case 'goal': newElement = new Goal({ x, y }); setLevel(prev => ({ ...prev, goal: newElement })); changeMade = true; break;
          case 'player-start': setLevel(prev => ({ ...prev, playerStart: { x, y } })); changeMade = true; break;
          default: break;
      }
      if (changeMade) { setHasUnsavedChanges(true); }
  }, [level, editorMode, selectedElement, isInverted, platformSize, isSelectingPortalDestination, pendingPortal, portalCounter, getLogicalCoords, eraseElementAt]);

  const handleCanvasContextMenu = useCallback((e) => {
      e.preventDefault(); if (isSelectingPortalDestination) { setIsSelectingPortalDestination(false); setPendingPortal(null); }
  }, [isSelectingPortalDestination]);

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
      const { x: logicalX, y: logicalY } = getLogicalCoords(e.clientX, e.clientY);
      const x = Math.round(logicalX); const y = Math.round(logicalY);
      const elementColor = getActiveColor(isInverted); let newPreviewElement = null;
      switch (selectedElement) {
          case 'platform': newPreviewElement = { type: 'platform', x, y, width: platformSize.width, height: platformSize.height, color: elementColor }; break;
          case 'spike': newPreviewElement = { type: 'spike', x, y: y , width: Spike.defaultWidth, height: Spike.defaultHeight, color: elementColor }; break; // Use y directly, render logic offsets
          case 'trampoline': newPreviewElement = { type: 'trampoline', x, y, width: Trampoline.defaultWidth, height: Trampoline.defaultHeight, color: elementColor }; break;
          case 'portal': newPreviewElement = { type: 'portal', x, y, width: 40, height: 60, color: 'purple' }; break;
          case 'goal': newPreviewElement = { type: 'goal', x, y, width: Goal.defaultWidth, height: Goal.defaultHeight }; break;
          case 'player-start': newPreviewElement = { type: 'player-start', x, y, width: 40, height: 40, color: elementColor }; break;
          default: break;
      }
      // Avoid unnecessary state updates if the preview hasn't changed position/type
      if (!previewElement || previewElement.type !== newPreviewElement?.type || previewElement.x !== newPreviewElement?.x || previewElement.y !== newPreviewElement?.y) {
         setPreviewElement(newPreviewElement);
      }
  }, [editorMode, selectedElement, isSelectingPortalDestination, isInverted, platformSize, getLogicalCoords, previewElement]); // Added previewElement dependency

  const handlePointerMove = useCallback((e) => {
      const isTouchEvent = e.type.startsWith('touch');
      const clientX = isTouchEvent ? e.touches[0].clientX : e.clientX;
      const clientY = isTouchEvent ? e.touches[0].clientY : e.clientY;
      if (editorMode === 'pan' && isDraggingCanvas.current) {
          handleDragMove(clientX, clientY, e);
      } else if (!isTouchEvent) { // Only update preview on mouse move, not touch move (usually)
          handleCanvasMouseMoveForPreview(e);
      }
  }, [editorMode, handleDragMove, handleCanvasMouseMoveForPreview]);


  // --- Funciones Guardar/Exportar/Importar/Salir ---
  const handleSave = useCallback(() => { if (!level) return; if (!level.name || level.name === 'Untitled Level' || levelId === 'new') { setLevelName(level.name === 'Untitled Level' ? '' : level.name || ''); setSaveDialogOpen(true); return; } const savedLevelId = saveUserLevel(level, levelId); if (savedLevelId) { setHasUnsavedChanges(false); /* navigate('/user-levels'); // Don't navigate away */ alert('Nivel guardado.'); } else { alert("Error al guardar el nivel existente."); } }, [level, levelId, navigate, levelName]); // Added levelName dependency
  const handleSaveConfirm = useCallback(() => {
    if (!level || !levelName.trim()) { alert("Por favor, introduce un nombre válido para el nivel."); return; }
    const levelToSave = { ...level, name: levelName.trim() };
    const idToSaveUnder = levelId === 'new' ? null : levelId; // Save as new if it's 'new', otherwise update existing
    const savedLevelId = saveUserLevel(levelToSave, idToSaveUnder);
    if (savedLevelId) {
        setSaveDialogOpen(false);
        setHasUnsavedChanges(false);
        alert('Nivel guardado.');
        // If it was a new level, navigate to the editor page with the new ID
        if (levelId === 'new') {
            navigate(`/editor/${savedLevelId}`, { replace: true });
        } else {
            // If updating an existing level, just update the state in case name changed etc.
             setLevel(levelToSave); // Update local level state
        }
    } else {
        alert("Error al guardar el nivel.");
    } }, [level, levelName, levelId, navigate]);
  const handleExport = useCallback(() => { if (!level) return; const finalLevelName = levelName || level.name || 'untitled-level'; const levelToExport = { ...level, name: finalLevelName }; const levelData = JSON.stringify(levelToExport, (key, value) => (key === 'id' && value?.startsWith && value.startsWith('imported_')) ? undefined : value , 2); const blob = new Blob([levelData], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${finalLevelName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); }, [level, levelName]);
  const handleImport = useCallback(() => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'; input.onchange = (e) => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = (event) => { try { const importedLevel = JSON.parse(event.target.result); if (!importedLevel || typeof importedLevel.playerStart !== 'object' || typeof importedLevel.goal !== 'object') { throw new Error("Invalid level file structure."); } const reconstructedLevel = { ...createEmptyLevel(), ...importedLevel, id: levelId === 'new' ? `imported_${Date.now()}` : levelId, name: importedLevel.name || 'Imported Level', platforms: (importedLevel.platforms || []).map(p => new Platform(p)), obstacles: (importedLevel.obstacles || []).map(o => new Spike(o)), trampolines: (importedLevel.trampolines || []).map(t => new Trampoline(t)), portals: (importedLevel.portals || []).map(p => new Portal(p)), goal: new Goal(importedLevel.goal) }; setLevel(reconstructedLevel); setHasUnsavedChanges(true); setLevelName(reconstructedLevel.name); const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0)); setPortalCounter(maxPortalId + 1); alert('Nivel importado con éxito. Recuerda guardarlo.'); } catch (error) { console.error('Error al importar el nivel:', error); alert(`Error al importar el nivel: ${error.message}. Asegúrate de que el archivo JSON es válido.`); } }; reader.readAsText(file); }; input.click(); }, [levelId]);
  const handleGoBack = useCallback(() => { if (hasUnsavedChanges) { setIsExitConfirmModalOpen(true); } else { navigate('/user-levels'); } }, [hasUnsavedChanges, navigate]);
  const handleConfirmExit = useCallback(() => { setHasUnsavedChanges(false); setIsExitConfirmModalOpen(false); navigate('/user-levels'); }, [navigate]);
  const handleCancelExit = useCallback(() => { setIsExitConfirmModalOpen(false); }, []);

  // --- Seleccionar Elemento ---
  const handleSelectElement = useCallback((elementName) => {
    setSelectedElement(elementName);
    // Always switch to 'place' mode when selecting an element button
    setEditorMode('place');
    // Reset portal selection state if active
    setIsSelectingPortalDestination(false);
    setPendingPortal(null);
  }, []);


  // --- Renderizado ---
  if (!level) { return <div>Cargando editor...</div>; }
  const oppositeColor = getInactiveColor(isInverted);
  const currentColor = getActiveColor(isInverted);

  return (
    <EditorContainer isInverted={isInverted}>
      <EditorToolbar>
        <ToolbarGroup className="left-group"><BackArrow onClick={handleGoBack} /></ToolbarGroup>
        <ToolbarGroup className="center-group">
          <ToolbarItem
            isActive={editorMode === 'place'}
            onClick={() => { setEditorMode('place'); if (!selectedElement) setSelectedElement('platform'); }}
            isInverted={isInverted}
          >Colocar</ToolbarItem>
          <ToolbarItem
             isActive={editorMode === 'erase'}
             onClick={() => { setEditorMode('erase'); setSelectedElement(null); /* Clear selection when choosing erase */ }}
             isInverted={isInverted}
           >Borrar</ToolbarItem>
          <ToolbarItem onClick={toggleInversion} isInverted={isInverted}>Invertir (E)</ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup className="right-group">
          <ToolbarItem onClick={handleExport} isInverted={isInverted}>Exportar</ToolbarItem>
          <ToolbarItem onClick={handleImport} isInverted={isInverted}>Importar</ToolbarItem>
          <ToolbarItem onClick={handleSave} isInverted={isInverted} disabled={!level}>Guardar{hasUnsavedChanges ? '*' : ''}</ToolbarItem>
        </ToolbarGroup>
      </EditorToolbar>

      <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>
        <EditorCanvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
          onMouseMove={handlePointerMove} // Handles both drag move and preview move
          onMouseDown={(e) => handleDragStart(e.clientX, e.clientY)} // Pass coords for mouse
          onMouseUp={handleDragEnd}
          onMouseLeave={handleCanvasMouseLeave}
          // Eventos Táctiles
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX, e.touches[0].clientY)} // Pass coords for touch
          onTouchMove={handlePointerMove}
          onTouchEnd={handleDragEnd}
          isInverted={isInverted}
          editorMode={editorMode}
          isDragging={isDraggingCanvas.current}
        >
          <LevelContentWrapper
             ref={contentWrapperRef}
             logicalWidth={LOGICAL_LEVEL_WIDTH}
             logicalHeight={LOGICAL_LEVEL_HEIGHT}
             isInverted={isInverted}
             style={{ transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoomLevel})` }}
          >
            {/* Preview */}
             {previewElement && previewElement.type === 'trampoline' && ( <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: previewElement.width, height: previewElement.height, backgroundColor: previewElement.color || 'transparent', borderRadius: '50% 50% 0 0', opacity: 0.5, border: `1px dashed ${previewElement.color === 'black' ? 'white' : 'black'}`, pointerEvents: 'none' }} /> )}
             {/* Preview Spike: position based on base (y), render upwards */}
             {previewElement && previewElement.type === 'spike' && ( <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y - previewElement.height, width: 0, height: 0, borderLeft: `${previewElement.width / 2}px solid transparent`, borderRight: `${previewElement.width / 2}px solid transparent`, borderBottom: `${previewElement.height}px solid ${previewElement.color}`, opacity: 0.5, pointerEvents: 'none' }} /> )}
             {previewElement && previewElement.type !== 'trampoline' && previewElement.type !== 'spike' && ( <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: previewElement.width, height: previewElement.height, backgroundColor: previewElement.type === 'player-start' || previewElement.type === 'platform' ? previewElement.color : 'transparent', opacity: 0.5, border: `2px dashed ${previewElement.type === 'goal' ? (isInverted ? 'black' : 'white') : (previewElement.type === 'portal' ? 'purple' : (previewElement.color === 'black' ? 'white' : 'black'))}`, borderRadius: previewElement.type === 'goal' ? '50%' : (previewElement.type === 'portal' ? '8px' : '0'), pointerEvents: 'none' }} /> )}
              {/* Elementos Reales */}
              {level.platforms.map((platform, index) => ( <div key={`platform-${index}`} style={{ position: 'absolute', left: platform.x, top: platform.y, width: platform.width, height: platform.height, backgroundColor: platform.color === currentColor ? platform.color : 'transparent', border: `1px solid ${platform.color === 'black' ? 'white' : 'black'}`, boxSizing: 'border-box' }} /> ))}
              {/* Real Spike: position based on base (y), render upwards */}
              {level.obstacles.map((obstacle, index) => ( <div key={`obstacle-${index}`} style={{ position: 'absolute', left: obstacle.x, top: obstacle.y - obstacle.height, width: 0, height: 0, borderLeft: `${obstacle.width / 2}px solid transparent`, borderRight: `${obstacle.width / 2}px solid transparent`, borderBottom: `${obstacle.height}px solid ${obstacle.color}`, opacity: obstacle.color === currentColor ? 1 : 0.3, filter: `drop-shadow(0px 0px 1px ${obstacle.color === 'black' ? 'white' : 'black'})` }}/> ))}
              {level.trampolines.map((trampoline, index) => ( <div key={`trampoline-${index}`} style={{ position: 'absolute', left: trampoline.x, top: trampoline.y, width: trampoline.width, height: trampoline.height, backgroundColor: trampoline.color === currentColor ? trampoline.color : 'transparent', border: `1px solid ${trampoline.color === 'black' ? 'white' : 'black'}`, borderRadius: '50% 50% 0 0', opacity: trampoline.color === currentColor ? 1 : 0.3 }} /> ))}
              {level.portals.map((portal, index) => ( <React.Fragment key={`portal-${index}`}> <div style={{ position: 'absolute', left: portal.x, top: portal.y, width: portal.width, height: portal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${portal.width * 0.5}px`, fontWeight: 'bold' }}>{portal.portalId}</div> {portal.destination && ( <div style={{ position: 'absolute', left: portal.destination.x, top: portal.destination.y, width: 20, height: 20, border: '2px dashed purple', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.6, color: 'purple', fontSize: '12px', fontWeight: 'bold' }}>{portal.portalId}</div> )} </React.Fragment> ))}
              {level.goal && ( <div style={{ position: 'absolute', left: level.goal.x, top: level.goal.y, width: level.goal.width, height: level.goal.height, border: `3px dashed ${currentColor}`, borderRadius: '50%' }} /> )}
              {level.playerStart && ( <div style={{ position: 'absolute', left: level.playerStart.x, top: level.playerStart.y, width: 40, height: 40, backgroundColor: currentColor, opacity: 0.7 }} /> )}
              {pendingPortal && ( <div style={{ position: 'absolute', left: pendingPortal.x, top: pendingPortal.y, width: pendingPortal.width, height: pendingPortal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${pendingPortal.width * 0.5}px`, fontWeight: 'bold' }}>{pendingPortal.portalId}</div> )}
          </LevelContentWrapper>

          <ZoomControls>
              {/* Stop propagation to prevent placing elements when clicking zoom buttons */}
              <ZoomButton onClick={(e) => { e.stopPropagation(); handleZoomIn(); }} isInverted={isInverted} title="Acercar (+)">+</ZoomButton>
              <ZoomButton onClick={(e) => { e.stopPropagation(); handleZoomOut(); }} isInverted={isInverted} title="Alejar (-)">-</ZoomButton>
              <ZoomButton
                onClick={(e) => { e.stopPropagation(); handlePanModeToggle(); }}
                isInverted={isInverted}
                isActive={editorMode === 'pan'}
                title="Mover Vista (Espacio)"
              >
                <FaHandPaper /> </ZoomButton>
           </ZoomControls>

           {isSelectingPortalDestination && (
             <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: getActiveColor(isInverted), color: getInactiveColor(isInverted), padding: '8px 15px', borderRadius: '5px', textAlign: 'center', zIndex: 50, opacity: 0.9, fontSize: '14px', pointerEvents: 'none' }}>
               Haz clic para establecer el destino del portal {portalCounter}, o clic derecho / Esc para cancelar.
             </div>
           )}
        </EditorCanvas>

        <EditorSidebar isInverted={isInverted}>
            <SidebarTitle isInverted={isInverted}>Elementos</SidebarTitle>
            <ElementsContainer>
             {/* Disable buttons when in pan mode, check isSelected only against 'place' mode */}
             <ElementButton onClick={() => handleSelectElement('platform')} isSelected={selectedElement === 'platform' && editorMode === 'place'} isInverted={isInverted} disabled={editorMode === 'pan'}> <div><div style={{ width: '30px', height: '10px', backgroundColor: oppositeColor, border: `1px solid ${currentColor}` }}></div></div>Plataforma </ElementButton>
             <ElementButton onClick={() => handleSelectElement('spike')} isSelected={selectedElement === 'spike' && editorMode === 'place'} isInverted={isInverted} disabled={editorMode === 'pan'}> <div><div style={{ width: '30px', height: '20px', position: 'relative' }}> <div style={{ position: 'absolute', width: 0, height: 0, left: 0, bottom: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: `20px solid ${oppositeColor}`, filter: `drop-shadow(0px 0px 1px ${currentColor})` }}></div> </div></div>Pico </ElementButton>
             <ElementButton onClick={() => handleSelectElement('trampoline')} isSelected={selectedElement === 'trampoline' && editorMode === 'place'} isInverted={isInverted} disabled={editorMode === 'pan'}> <div><div style={{ width: '30px', height: '15px', backgroundColor: oppositeColor, borderRadius: '15px 15px 0 0', border: `1px solid ${currentColor}` }}></div></div>Trampolín </ElementButton>
             <ElementButton onClick={() => handleSelectElement('portal')} isSelected={selectedElement === 'portal' && editorMode === 'place'} isInverted={isInverted} disabled={editorMode === 'pan'}> <div><div style={{ width: '30px', height: '30px', backgroundColor: 'purple', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.8, border: '1px solid white' }}><span style={{ color: 'white', fontSize: '16px' }}>◊</span></div></div>Portal </ElementButton>
             <ElementButton onClick={() => handleSelectElement('goal')} isSelected={selectedElement === 'goal' && editorMode === 'place'} isInverted={isInverted} disabled={editorMode === 'pan'}> <div><div style={{ width: '20px', height: '20px', border: `2px dashed ${currentColor}`, borderRadius: '50%' }}></div></div>Meta </ElementButton>
             <ElementButton onClick={() => handleSelectElement('player-start')} isSelected={selectedElement === 'player-start' && editorMode === 'place'} isInverted={isInverted} disabled={editorMode === 'pan'}> <div><div style={{ width: '20px', height: '20px', backgroundColor: currentColor, opacity: 0.7 }}></div></div>Inicio Jugador </ElementButton>
           </ElementsContainer>
           {selectedElement === 'platform' && editorMode === 'place' && ( // Show only in place mode
             <div style={{ marginTop: '20px', padding: '10px', border: `1px solid ${currentColor}50`, borderRadius: '5px' }}>
                <h3 style={{ color: currentColor, marginBottom: '10px', fontSize: '16px' }}>Tamaño Plataforma</h3>
                <div style={{ marginBottom: '10px' }}> <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>Ancho: {platformSize.width}px</label> <input type="range" min="20" max="500" value={platformSize.width} onChange={(e) => setPlatformSize(prev => ({ ...prev, width: Number(e.target.value) }))} style={{ width: '100%' }} /> </div>
                <div> <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>Alto: {platformSize.height}px</label> <input type="range" min="10" max="100" value={platformSize.height} onChange={(e) => setPlatformSize(prev => ({ ...prev, height: Number(e.target.value) }))} style={{ width: '100%' }} /> </div>
             </div>
            )}
        </EditorSidebar>
      </div>

      {/* Modales */}
      {saveDialogOpen && (
        <SaveDialog onClick={() => setSaveDialogOpen(false)}> {/* Close on backdrop click */}
            <SaveDialogContent isInverted={isInverted} onClick={(e) => e.stopPropagation()} > {/* Prevent closing when clicking inside */}
                <h2>Guardar Nivel</h2> <p>Introduce un nombre para tu nivel:</p>
                <Input type="text" value={levelName} onChange={(e) => setLevelName(e.target.value)} placeholder="Nombre del nivel" isInverted={isInverted} autoFocus onKeyDown={(e) => { e.stopPropagation(); if (e.key === 'Enter' && levelName.trim()) { handleSaveConfirm(); } if (e.key === 'Escape') { setSaveDialogOpen(false); } }} />
                <SaveDialogButtons isInverted={isInverted}> <button onClick={() => setSaveDialogOpen(false)}>Cancelar</button> <button onClick={handleSaveConfirm} disabled={!levelName.trim()} > Guardar </button> </SaveDialogButtons>
          </SaveDialogContent>
        </SaveDialog>
      )}
      <ConfirmationModal isOpen={isExitConfirmModalOpen} onClose={handleCancelExit} onConfirm={handleConfirmExit} message="¿Estás seguro de que quieres salir? Se perderán los cambios no guardados." isInverted={isInverted} />

    </EditorContainer>
  );
};

export default LevelEditor;
// --- END OF FILE LevelEditor.jsx ---