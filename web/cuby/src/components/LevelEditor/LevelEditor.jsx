// --- START OF FILE LevelEditor.jsx ---

// Asegúrate de que estas importaciones estén presentes
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../common/ConfirmationModal/ConfirmationModal'; // <-- IMPORTA EL MODAL
import BackArrow from '../common/BackArrow/BackArrow';
import { useInversion } from '../../context/InversionContext';
// ... el resto de tus importaciones ...
import {
  EditorContainer,
  EditorSidebar,
  EditorCanvas,
  SidebarTitle,
  ElementsContainer,
  ElementButton,
  EditorToolbar,
  ToolbarItem,
  SaveDialog,
  SaveDialogContent,
  Input,
  SaveDialogButtons
} from './LevelEditor.styles';
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';
import { getUserLevelById, saveUserLevel, createEmptyLevel } from '../../utils/levelManager';
import { getActiveColor, getInactiveColor } from '../../utils/colors';


const LevelEditor = () => {
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
  const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false); // <-- NUEVO ESTADO PARA EL MODAL DE SALIDA

  // --- useEffect para teclas ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prioritize closing modals with Escape
      if (e.key === 'Escape') {
        if (saveDialogOpen) {
          setSaveDialogOpen(false);
          return; // Stop further processing if a modal was closed
        }
        if (isExitConfirmModalOpen) {
          setIsExitConfirmModalOpen(false); // Cierra el modal de salida
          return;
        }
        if (isSelectingPortalDestination) {
           setIsSelectingPortalDestination(false);
           setPendingPortal(null);
           return;
        }
        // If no modal/action handled, allow default back navigation or other Escape behavior
      }

      // Handle 'E' for inversion only if no dialogs are open
      if (e.key.toLowerCase() === 'e' && !eKeyPressed && !saveDialogOpen) {
        setEKeyPressed(true);
        toggleInversion();
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
    // Añade isExitConfirmModalOpen a las dependencias
  }, [toggleInversion, eKeyPressed, saveDialogOpen, isExitConfirmModalOpen, isSelectingPortalDestination, navigate]);


  // --- useEffect para cargar nivel --- (sin cambios)
  useEffect(() => {
    if (levelId === 'new') {
      setLevel(createEmptyLevel());
      setHasUnsavedChanges(false);
    } else {
      const existingLevel = getUserLevelById(levelId);
      if (existingLevel) {
         const reconstructedLevel = {
          // ... (resto de la lógica de reconstrucción)
          ...existingLevel,
          platforms: (existingLevel.platforms || []).map(p => p instanceof Platform ? p : new Platform(p)),
          obstacles: (existingLevel.obstacles || []).map(o => o instanceof Spike ? o : new Spike(o)),
          trampolines: (existingLevel.trampolines || []).map(t => t instanceof Trampoline ? t : new Trampoline(t)),
          portals: (existingLevel.portals || []).map(p => p instanceof Portal ? p : new Portal(p)),
          goal: existingLevel.goal instanceof Goal ? existingLevel.goal : new Goal(existingLevel.goal || { x: 700, y: 500 })
        };
        setLevel(reconstructedLevel);
        setHasUnsavedChanges(false);
        setLevelName(reconstructedLevel.name || '');
        const maxPortalId = Math.max(...(reconstructedLevel.portals || []).map(p => p.portalId || 0), 0);
        setPortalCounter(maxPortalId + 1);
      } else {
        setLevel(createEmptyLevel());
        setHasUnsavedChanges(false);
      }
    }
  }, [levelId]);

  // --- useEffect para beforeunload --- (sin cambios, este es para cierre de navegador/pestaña)
  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir? Se perderán los cambios no guardados.';
        return e.returnValue;
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [hasUnsavedChanges]);

  // --- Resto de funciones (handleCanvasClick, eraseElementAt, handleSave, handleSaveConfirm, handleExport, handleImport, etc.) ---
  // --- SIN CAMBIOS ---
   const handleCanvasClick = (e) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (editorMode === 'erase') {
      eraseElementAt(x, y);
      return;
    }

    if (!selectedElement || !level) return;
    const elementColor = getActiveColor(isInverted);
    let newElement;

    switch (selectedElement) {
       case 'platform':
        newElement = new Platform({
          x, y,
          color: elementColor,
          width: platformSize.width,
          height: platformSize.height
        });
        setLevel(prevLevel => ({
          ...prevLevel,
          platforms: [...prevLevel.platforms, newElement]
        }));
        setHasUnsavedChanges(true);
        break;
      case 'spike':
         newElement = new Spike({
            x,
            y: y - Spike.defaultHeight, // Adjust y to place base at cursor
            color: elementColor
        });
        setLevel(prevLevel => ({
            ...prevLevel,
            obstacles: [...prevLevel.obstacles, newElement]
        }));
        setHasUnsavedChanges(true);
        break;
       case 'trampoline':
         newElement = new Trampoline({ x, y, color: elementColor });
          setLevel(prevLevel => ({
              ...prevLevel,
              trampolines: [...prevLevel.trampolines, newElement]
          }));
         setHasUnsavedChanges(true);
         break;
      case 'portal':
        if (isSelectingPortalDestination && pendingPortal) {
          const finalPortal = new Portal({
            ...pendingPortal,
            destination: { x, y },
            portalId: portalCounter
          });
          setLevel(prevLevel => ({
            ...prevLevel,
            portals: [...prevLevel.portals, finalPortal]
          }));
          setHasUnsavedChanges(true);
          setIsSelectingPortalDestination(false);
          setPendingPortal(null);
          setPortalCounter(prev => prev + 1);
        } else {
          const newPortalBase = {
            x,
            y,
            color: elementColor, // Portals might have fixed color or use theme
            width: 40,
            height: 60,
            portalId: portalCounter
          };
          setPendingPortal(newPortalBase);
          setIsSelectingPortalDestination(true);
        }
        break;
      case 'goal':
        newElement = new Goal({ x, y });
         // Only allow one goal - replace existing
        setLevel(prevLevel => ({
            ...prevLevel,
            goal: newElement
        }));
        setHasUnsavedChanges(true);
        break;
      case 'player-start':
         // Only allow one start point - replace existing
        setLevel(prevLevel => ({
            ...prevLevel,
            playerStart: { x, y }
        }));
        setHasUnsavedChanges(true);
        break;
      default:
        break;
    }
  };

  const handleCanvasContextMenu = (e) => {
    e.preventDefault();
    if (isSelectingPortalDestination) {
      setIsSelectingPortalDestination(false);
      setPendingPortal(null);
    }
     // Optional: Could add functionality like deselecting element or opening context menu
  };

  const handleCanvasMouseMove = (e) => {
    if (editorMode === 'erase' || !selectedElement || isSelectingPortalDestination) {
      setPreviewElement(null);
      return;
    }

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const elementColor = getActiveColor(isInverted);
    let newPreviewElement;

    switch (selectedElement) {
      case 'platform':
        newPreviewElement = { type: 'platform', x, y, width: platformSize.width, height: platformSize.height, color: elementColor };
        break;
      case 'spike':
        newPreviewElement = { type: 'spike', x, y: y - Spike.defaultHeight, width: Spike.defaultWidth, height: Spike.defaultHeight, color: elementColor };
        break;
      case 'trampoline':
        newPreviewElement = { type: 'trampoline', x, y, width: Trampoline.defaultWidth, height: Trampoline.defaultHeight, color: elementColor };
        break;
      case 'portal':
        newPreviewElement = { type: 'portal', x, y, width: 40, height: 60, color: 'purple' }; // Fixed color for portal preview
        break;
      case 'goal':
        newPreviewElement = { type: 'goal', x, y, width: Goal.defaultWidth, height: Goal.defaultHeight };
        break;
      case 'player-start':
        newPreviewElement = { type: 'player-start', x, y, width: 40, height: 40, color: elementColor };
        break;
      default: newPreviewElement = null;
    }
    setPreviewElement(newPreviewElement);
  };

  const handleCanvasMouseLeave = () => {
    setPreviewElement(null);
  };

   const eraseElementAt = (x, y) => {
    if (!level) return;

    const isPointInElement = (point, element, defaultSize = { width: 40, height: 40 }) => {
      const width = element.width || defaultSize.width;
      const height = element.height || defaultSize.height;
      // For spikes, the clickable area might be slightly different depending on placement logic
      // Let's assume x,y is top-left for now for simplicity in erase check
      return (
        point.x >= element.x &&
        point.x <= element.x + width &&
        point.y >= element.y &&
        point.y <= element.y + height
      );
    };

    let changed = false;
    const updatedPlatforms = level.platforms.filter(p => !isPointInElement({ x, y }, p));
    if (updatedPlatforms.length !== level.platforms.length) changed = true;

    const updatedObstacles = level.obstacles.filter(o => !isPointInElement({ x, y }, o, { width: Spike.defaultWidth, height: Spike.defaultHeight }));
     if (updatedObstacles.length !== level.obstacles.length) changed = true;

    const updatedTrampolines = level.trampolines.filter(t => !isPointInElement({ x, y }, t, { width: Trampoline.defaultWidth, height: Trampoline.defaultHeight }));
     if (updatedTrampolines.length !== level.trampolines.length) changed = true;

     // Check portals based on their main body, not destination
    const updatedPortals = level.portals.filter(p => !isPointInElement({ x, y }, p, { width: p.width || 40, height: p.height || 60 }));
    if (updatedPortals.length !== level.portals.length) changed = true;


    const updatedLevel = { ...level };

    // Check player start
    if (isPointInElement({ x, y }, level.playerStart, { width: 40, height: 40 })) {
      // Reset player start to default if erased
       updatedLevel.playerStart = { x: 50, y: 450 }; // Or keep previous default
       changed = true;
    }

     // Check goal
    if (isPointInElement({ x, y }, level.goal, { width: Goal.defaultWidth, height: Goal.defaultHeight })) {
       // Reset goal to default if erased
       updatedLevel.goal = new Goal({ x: 700, y: 500 }); // Or keep previous default
       changed = true;
     }

    if (changed) {
        updatedLevel.platforms = updatedPlatforms;
        updatedLevel.obstacles = updatedObstacles;
        updatedLevel.trampolines = updatedTrampolines;
        updatedLevel.portals = updatedPortals; // Update portals as well
        setLevel(updatedLevel);
        setHasUnsavedChanges(true);
    }
};


  const handleSave = () => {
    if (!level) return;
    if (!level.name || level.name === 'Untitled Level' || levelId === 'new') {
       setLevelName(level.name === 'Untitled Level' ? '' : level.name || ''); // Pre-fill if exists but maybe needs confirmation
      setSaveDialogOpen(true);
      return;
    }
    const savedLevelId = saveUserLevel(level, levelId); // Use existing levelId if not 'new'
    if (savedLevelId) {
      setHasUnsavedChanges(false); // Mark as saved
      navigate('/user-levels'); // Redirect after saving existing
    }
  };

  const handleSaveConfirm = () => {
    if (!level || !levelName.trim()) {
      alert("Por favor, introduce un nombre válido para el nivel.");
      return;
    }
    const levelToSave = {
      ...level,
      name: levelName.trim()
    };
    const idToSaveUnder = levelId === 'new' ? null : levelId;
    const savedLevelId = saveUserLevel(levelToSave, idToSaveUnder);
    if (savedLevelId) {
      setSaveDialogOpen(false);
      setHasUnsavedChanges(false);
      // If it was a new level, navigate to the edit page of the newly saved level ID?
      // Or just back to the list. Let's go back to the list for simplicity.
      navigate('/user-levels');
    } else {
      alert("Error al guardar el nivel."); // Provide feedback on failure
    }
  };

  const handleExport = () => {
    if (!level) return;
    // Ensure the level name is up-to-date before exporting
    const levelToExport = { ...level, name: levelName || level.name || 'untitled-level' };
    const levelData = JSON.stringify(levelToExport, null, 2);
    const blob = new Blob([levelData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${levelToExport.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`; // Sanitize filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedLevel = JSON.parse(event.target.result);
          // Basic validation (check for essential properties)
          if (!importedLevel || typeof importedLevel.playerStart !== 'object' || typeof importedLevel.goal !== 'object') {
              throw new Error("Invalid level file structure.");
          }

           // Recreate class instances
          const reconstructedLevel = {
              ...createEmptyLevel(), // Start with defaults
              ...importedLevel, // Override with imported data
              id: levelId === 'new' ? `imported_${Date.now()}` : levelId, // Assign new ID if 'new', else keep current
              name: importedLevel.name || 'Imported Level',
              platforms: (importedLevel.platforms || []).map(p => new Platform(p)),
              obstacles: (importedLevel.obstacles || []).map(o => new Spike(o)),
              trampolines: (importedLevel.trampolines || []).map(t => new Trampoline(t)),
              portals: (importedLevel.portals || []).map(p => new Portal(p)),
              goal: new Goal(importedLevel.goal)
          };

          setLevel(reconstructedLevel);
          setHasUnsavedChanges(true); // Mark as changed after import
          setLevelName(reconstructedLevel.name);
          const maxPortalId = Math.max(...(reconstructedLevel.portals || []).map(p => p.portalId || 0), 0);
          setPortalCounter(maxPortalId + 1);
          alert('Nivel importado con éxito. Recuerda guardarlo.');

        } catch (error) {
          console.error('Error al importar el nivel:', error);
          alert(`Error al importar el nivel: ${error.message}. Asegúrate de que el archivo JSON es válido.`);
        }
      };
      reader.readText(file);
    };
    input.click();
  };


  // --- MODIFICACIÓN AQUÍ ---
  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      // Abre el modal de confirmación en lugar de window.confirm
      setIsExitConfirmModalOpen(true);
    } else {
      // Si no hay cambios, navega directamente
      navigate('/user-levels');
    }
  };

  // --- NUEVAS FUNCIONES PARA EL MODAL DE SALIDA ---
  const handleConfirmExit = () => {
    // El usuario confirma que quiere salir perdiendo cambios
    setHasUnsavedChanges(false); // Opcional: Resetea el estado si la navegación tiene éxito
    setIsExitConfirmModalOpen(false);
    navigate('/user-levels');
  };

  const handleCancelExit = () => {
    // El usuario cancela la salida, simplemente cierra el modal
    setIsExitConfirmModalOpen(false);
  };
  // --- FIN NUEVAS FUNCIONES ---

  if (!level) {
    return <div>Cargando editor...</div>;
  }

  const oppositeColor = getInactiveColor(isInverted);
  const currentColor = getActiveColor(isInverted);

  return (
    <EditorContainer isInverted={isInverted}>
       {/* Toolbar, Canvas, Sidebar... sin cambios */}
       <EditorToolbar>
        {/* BackArrow usa handleGoBack modificado */}
        <div style={{ position: 'absolute', left: '5px', top: '-10px' }}>
          <BackArrow onClick={handleGoBack} />
        </div>

        <div style={{ display: 'flex', margin: '0 auto', alignItems: 'center' }}>
          {/* ... Items Colocar, Borrar, Invertir ... */}
          <ToolbarItem
            isActive={editorMode === 'place'}
            onClick={() => setEditorMode('place')}
            isInverted={isInverted}
          >
            Colocar
          </ToolbarItem>
          <ToolbarItem
            isActive={editorMode === 'erase'}
            onClick={() => setEditorMode('erase')}
            isInverted={isInverted}
          >
            Borrar
          </ToolbarItem>
          <ToolbarItem
            onClick={toggleInversion}
            isInverted={isInverted}
            style={{ marginLeft: '20px' }}
          >
            Invertir Colores (E)
          </ToolbarItem>
        </div>

        <div style={{ position: 'absolute', right: '15px', display: 'flex', gap: '10px' }}>
           {/* ... Items Exportar, Importar, Guardar ... */}
           <ToolbarItem onClick={handleExport} isInverted={isInverted}>
            Exportar
          </ToolbarItem>
          <ToolbarItem onClick={handleImport} isInverted={isInverted}>
            Importar
          </ToolbarItem>
          <ToolbarItem onClick={handleSave} isInverted={isInverted}>
            Guardar Nivel {hasUnsavedChanges ? '*' : ''}
          </ToolbarItem>
        </div>
      </EditorToolbar>

      <div style={{ display: 'flex', flex: 1, width: '100%', overflow: 'hidden' }}>
        <EditorCanvas
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          isInverted={isInverted}
        >
           {/* ... Renderizado de preview y elementos ... */}
            {/* Render preview element */}
          {previewElement && previewElement.type === 'trampoline' && (
             <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: previewElement.width, height: previewElement.height, backgroundColor: previewElement.color || 'transparent', borderRadius: '50% 50% 0 0', opacity: 0.5, border: `1px dashed ${previewElement.color === 'black' ? 'white' : 'black'}`, pointerEvents: 'none' }} />
          )}
          {previewElement && previewElement.type === 'spike' && (
             <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: 0, height: 0, borderLeft: `${previewElement.width / 2}px solid transparent`, borderRight: `${previewElement.width / 2}px solid transparent`, borderBottom: `${previewElement.height}px solid ${previewElement.color}`, opacity: 0.5, pointerEvents: 'none' }} />
           )}
           {previewElement && previewElement.type !== 'trampoline' && previewElement.type !== 'spike' && (
             <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: previewElement.width, height: previewElement.height, backgroundColor: previewElement.type === 'player-start' || previewElement.type === 'platform' ? previewElement.color : 'transparent', opacity: 0.5, border: `2px dashed ${previewElement.type === 'goal' ? (isInverted ? 'black' : 'white') : (previewElement.type === 'portal' ? 'purple' : (previewElement.color === 'black' ? 'white' : 'black'))}`, borderRadius: previewElement.type === 'goal' ? '50%' : (previewElement.type === 'portal' ? '8px' : '0'), pointerEvents: 'none' }} />
           )}


          {/* Render level elements */}
          {level.platforms.map((platform, index) => (
            <div key={`platform-${index}`} style={{ position: 'absolute', left: platform.x, top: platform.y, width: platform.width, height: platform.height, backgroundColor: platform.color === currentColor ? platform.color : 'transparent', border: `1px solid ${platform.color === 'black' ? 'white' : 'black'}`, boxSizing: 'border-box' }} />
          ))}
          {level.obstacles.map((obstacle, index) => (
            <div key={`obstacle-${index}`} style={{ position: 'absolute', left: obstacle.x, top: obstacle.y, width: 0, height: 0, borderLeft: `${obstacle.width / 2}px solid transparent`, borderRight: `${obstacle.width / 2}px solid transparent`, borderBottom: `${obstacle.height}px solid ${obstacle.color}`, opacity: obstacle.color === currentColor ? 1 : 0.3, filter: `drop-shadow(0px 0px 1px ${obstacle.color === 'black' ? 'white' : 'black'})` }}/>
          ))}
          {level.trampolines.map((trampoline, index) => (
            <div key={`trampoline-${index}`} style={{ position: 'absolute', left: trampoline.x, top: trampoline.y, width: trampoline.width, height: trampoline.height, backgroundColor: trampoline.color === currentColor ? trampoline.color : 'transparent', border: `1px solid ${trampoline.color === 'black' ? 'white' : 'black'}`, borderRadius: '50% 50% 0 0', opacity: trampoline.color === currentColor ? 1 : 0.3 }} />
          ))}
          {level.portals.map((portal, index) => (
            <React.Fragment key={`portal-${index}`}>
              <div style={{ position: 'absolute', left: portal.x, top: portal.y, width: portal.width, height: portal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${portal.width * 0.5}px`, fontWeight: 'bold' }}>{portal.portalId}</div>
              {portal.destination && (
                <div style={{ position: 'absolute', left: portal.destination.x, top: portal.destination.y, width: 20, height: 20, border: '2px dashed purple', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.6, color: 'purple', fontSize: '12px', fontWeight: 'bold' }}>{portal.portalId}</div>
              )}
            </React.Fragment>
          ))}
          {level.goal && (
             <div style={{ position: 'absolute', left: level.goal.x, top: level.goal.y, width: level.goal.width, height: level.goal.height, border: `3px dashed ${currentColor}`, borderRadius: '50%' }} />
           )}
          {level.playerStart && (
             <div style={{ position: 'absolute', left: level.playerStart.x, top: level.playerStart.y, width: 40, height: 40, backgroundColor: currentColor, opacity: 0.7 }} />
           )}

          {/* Portal placement UI */}
           {isSelectingPortalDestination && (
             <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: getActiveColor(isInverted), color: getInactiveColor(isInverted), padding: '10px', textAlign: 'center', zIndex: 100, opacity: 0.9 }}>
               Haz clic para establecer el destino del portal {portalCounter}, o clic derecho para cancelar.
             </div>
           )}
           {pendingPortal && ( // Show the first portal placement while selecting destination
             <div style={{ position: 'absolute', left: pendingPortal.x, top: pendingPortal.y, width: pendingPortal.width, height: pendingPortal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${pendingPortal.width * 0.5}px`, fontWeight: 'bold' }}>{pendingPortal.portalId}</div>
           )}
        </EditorCanvas>

        <EditorSidebar isInverted={isInverted}>
            {/* ... Contenido de la Sidebar ... */}
            <SidebarTitle isInverted={isInverted}>Elementos</SidebarTitle>
           <ElementsContainer>
             {/* Element Buttons using ElementButton styled component */}
            <ElementButton onClick={() => { setSelectedElement('platform'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'platform'} isInverted={isInverted}>
                 <div style={{ display: 'flex', alignItems: 'center' }}>
                   <div style={{ width: '30px', height: '10px', backgroundColor: oppositeColor, marginRight: '10px', border: `1px solid ${currentColor}` }}></div>Plataforma
                 </div>
            </ElementButton>
            <ElementButton onClick={() => { setSelectedElement('spike'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'spike'} isInverted={isInverted}>
                 <div style={{ display: 'flex', alignItems: 'center' }}>
                   <div style={{ width: '30px', height: '20px', marginRight: '10px', position: 'relative' }}>
                     <div style={{ position: 'absolute', width: 0, height: 0, left: 0, bottom: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: `20px solid ${oppositeColor}`, filter: `drop-shadow(0px 0px 1px ${currentColor})` }}></div>
                   </div>Pico
                 </div>
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('trampoline'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'trampoline'} isInverted={isInverted}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '30px', height: '15px', backgroundColor: oppositeColor, marginRight: '10px', borderRadius: '15px 15px 0 0', border: `1px solid ${currentColor}` }}></div>Trampolín
               </div>
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('portal'); /* Don't reset portal state here */ }} isSelected={selectedElement === 'portal'} isInverted={isInverted}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '30px', height: '30px', backgroundColor: 'purple', marginRight: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.8, border: '1px solid white' }}><span style={{ color: 'white', fontSize: '16px' }}>◊</span></div>Portal
               </div>
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('goal'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'goal'} isInverted={isInverted}>
               <div style={{ display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '20px', height: '20px', marginRight: '10px', border: `2px dashed ${currentColor}`, borderRadius: '50%' }}></div>Meta
               </div>
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('player-start'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'player-start'} isInverted={isInverted}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '20px', height: '20px', backgroundColor: currentColor, marginRight: '10px', opacity: 0.7 }}></div>Inicio Jugador
                </div>
             </ElementButton>
           </ElementsContainer>

           {selectedElement === 'platform' && (
             <div style={{ marginTop: '20px', padding: '10px', border: `1px solid ${currentColor}50`, borderRadius: '5px' }}>
               <h3 style={{ color: currentColor, marginBottom: '10px', fontSize: '16px' }}>Tamaño Plataforma</h3>
               <div style={{ marginBottom: '10px' }}>
                 <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>Ancho: {platformSize.width}px</label>
                 <input type="range" min="20" max="500" value={platformSize.width} onChange={(e) => setPlatformSize(prev => ({ ...prev, width: Number(e.target.value) }))} style={{ width: '100%' }} />
               </div>
               <div>
                 <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>Alto: {platformSize.height}px</label>
                 <input type="range" min="10" max="100" value={platformSize.height} onChange={(e) => setPlatformSize(prev => ({ ...prev, height: Number(e.target.value) }))} style={{ width: '100%' }} />
               </div>
             </div>
           )}
        </EditorSidebar>
      </div>

      {/* --- Save Dialog --- */}
      {saveDialogOpen && (
        <SaveDialog>
           {/* ... Contenido del diálogo de guardar ... */}
            <SaveDialogContent isInverted={isInverted}>
                <h2>Guardar Nivel</h2>
                <p>Introduce un nombre para tu nivel:</p>
                <Input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                placeholder="Nombre del nivel"
                isInverted={isInverted}
                autoFocus
                onKeyDown={(e) => {
                    e.stopPropagation(); // Prevent 'E' key from toggling inversion
                    if (e.key === 'Enter') {
                        handleSaveConfirm(); // Allow saving with Enter key
                    }
                     if (e.key === 'Escape') {
                       setSaveDialogOpen(false); // Allow closing with Escape
                     }
                }}
                />
                <SaveDialogButtons isInverted={isInverted}>
                {/* Usamos el componente ConfirmationModal con los estilos correctos */}
                <button onClick={() => setSaveDialogOpen(false)}>Cancelar</button> {/* Estilo de botón de cancelar por defecto del modal */}
                <button
                    onClick={handleSaveConfirm}
                    disabled={!levelName.trim()} // Disable if name is empty or whitespace
                    // style={{ backgroundColor: getActiveColor(isInverted), color: getInactiveColor(isInverted) }} // Estilo de botón de confirmar
                >
                    Guardar
                </button>
                </SaveDialogButtons>
          </SaveDialogContent>
        </SaveDialog>
      )}

      {/* --- NUEVO MODAL DE CONFIRMACIÓN DE SALIDA --- */}
      <ConfirmationModal
        isOpen={isExitConfirmModalOpen}
        onClose={handleCancelExit} // Función para cerrar (botón Cancelar o clic fuera)
        onConfirm={handleConfirmExit} // Función para confirmar (botón Confirmar)
        message="¿Estás seguro de que quieres salir? Se perderán los cambios no guardados."
        isInverted={isInverted} // Pasa el estado de inversión para los estilos
      />
      {/* --- FIN NUEVO MODAL --- */}

    </EditorContainer>
  );
};

export default LevelEditor;
// --- END OF FILE LevelEditor.jsx ---