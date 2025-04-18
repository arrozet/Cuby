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
  ElementButton, // Ensure ElementButton is imported
  EditorToolbar,
  ToolbarItem,
  SaveDialog,
  SaveDialogContent,
  Input,
  SaveDialogButtons,
  EditorMainArea, // Import the new main area container
  SidebarToggleButton // Import the toggle button
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
  const [isExitConfirmModalOpen, setIsExitConfirmModalOpen] = useState(false);
  // State for collapsible sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start collapsed on small screens
  // State to detect if we are on a small screen
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 640);

  // --- Navigation Handlers ---
  // Define these before the useEffect that uses them
  const handleGoBack = useCallback(() => {
    if (hasUnsavedChanges) {
      setIsExitConfirmModalOpen(true); // Open confirmation modal
    } else {
      // If no changes, navigate directly
      navigate('/user-levels');
    }
  }, [hasUnsavedChanges, navigate]); // Dependencies

  const handleConfirmExit = () => {
    setIsExitConfirmModalOpen(false);
    navigate('/user-levels'); // Navigate after confirming
  };

  const handleCancelExit = () => {
    setIsExitConfirmModalOpen(false); // Just close the modal
  };


  // Effect to check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const small = window.innerWidth <= 640;
      setIsSmallScreen(small);
      // If screen becomes large, ensure sidebar is not collapsed (optional)
      // if (!small) setIsSidebarCollapsed(false);
    };
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  // --- useEffect para teclas ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar teclas si un modal o diálogo está abierto, o si se está escribiendo en un input
      if (saveDialogOpen || isExitConfirmModalOpen || e.target.tagName === 'INPUT') {
        return;
      }

      if (e.key.toLowerCase() === 'e' && !eKeyPressed) {
        setEKeyPressed(true);
        toggleInversion();
      } else if (e.key === 'Escape') {
         if (isSelectingPortalDestination) {
           // Cancel portal placement first
           setIsSelectingPortalDestination(false);
           setPendingPortal(null);
         } else if (isSmallScreen && !isSidebarCollapsed) {
           // Close sidebar on small screens if open
           setIsSidebarCollapsed(true);
         } else {
           // Otherwise, handle back navigation confirmation
           handleGoBack(); // Now defined above
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
      toggleInversion,
      eKeyPressed,
      saveDialogOpen,
      isExitConfirmModalOpen,
      isSelectingPortalDestination,
      isSmallScreen, // Add dependency
      isSidebarCollapsed, // Add dependency
      handleGoBack // Add dependency (now safe)
  ]);


  // --- useEffect para cargar nivel --- (sin cambios)
  useEffect(() => {
    if (levelId === 'new') {
      setLevel(createEmptyLevel());
      setHasUnsavedChanges(false);
      setLevelName(''); // Ensure name is empty for new level
      setPortalCounter(1); // Reset portal counter
    } else {
      const existingLevel = getUserLevelById(levelId);
      if (existingLevel) {
         const reconstructedLevel = {
          ...createEmptyLevel(), // Start with defaults to ensure all properties exist
          ...existingLevel,
          // Re-create class instances to ensure methods are available
          platforms: (existingLevel.platforms || []).map(p => p instanceof Platform ? p : new Platform(p)),
          obstacles: (existingLevel.obstacles || []).map(o => o instanceof Spike ? o : new Spike(o)),
          trampolines: (existingLevel.trampolines || []).map(t => t instanceof Trampoline ? t : new Trampoline(t)),
          portals: (existingLevel.portals || []).map(p => p instanceof Portal ? p : new Portal(p)),
          goal: existingLevel.goal instanceof Goal ? existingLevel.goal : new Goal(existingLevel.goal || { x: 700, y: 500 }),
          playerStart: existingLevel.playerStart || { x: 50, y: 450 } // Ensure playerStart exists
        };
        setLevel(reconstructedLevel);
        setHasUnsavedChanges(false);
        setLevelName(reconstructedLevel.name || '');
        // Calculate next portal ID based on existing ones
        const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0));
        setPortalCounter(maxPortalId + 1);
      } else {
        // Handle case where levelId is provided but level not found
        console.error(`Level with ID ${levelId} not found.`);
        navigate('/user-levels'); // Redirect to user levels list
        // setLevel(createEmptyLevel()); // Or create a new one? Redirect seems safer.
        // setHasUnsavedChanges(false);
      }
    }
  }, [levelId, navigate]); // Add navigate to dependencies


  // --- useEffect para beforeunload --- (sin cambios)
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


  // --- Canvas Handlers (handleCanvasClick, eraseElementAt, etc.) ---
  // (No changes needed in the logic itself, just ensure coordinates are relative to canvas)
  const handleCanvasClick = (e) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    // Calculate click coordinates relative to the canvas element
    const x = e.clientX - rect.left + canvas.scrollLeft; // Account for canvas scroll
    const y = e.clientY - rect.top + canvas.scrollTop;   // Account for canvas scroll

    if (editorMode === 'erase') {
      eraseElementAt(x, y);
    } else if (editorMode === 'place' && selectedElement) {
      placeElement(x, y);
    }
  };

  const eraseElementAt = (x, y) => {
    if (!level) return;
    let changed = false;

    const isPointInElement = (point, element, size) => {
      // Ensure element and size are valid before accessing properties
      if (!element || !size) return false;
      // Use default 0 if width/height missing or explicitly 0
      const elementWidth = size.width || 0;
      const elementHeight = size.height || 0;
      return point.x >= element.x && point.x <= element.x + elementWidth &&
             point.y >= element.y && point.y <= element.y + elementHeight;
    };

    // Filter elements, keeping only those NOT clicked
    // Platforms use their own width/height
    const updatedPlatforms = level.platforms.filter(p => !isPointInElement({ x, y }, p, p));
    if (updatedPlatforms.length !== level.platforms.length) changed = true;

    // Spikes use default dimensions from the class
    const updatedObstacles = level.obstacles.filter(o => !isPointInElement({ x, y }, o, { width: Spike.defaultWidth, height: Spike.defaultHeight }));
    if (updatedObstacles.length !== level.obstacles.length) changed = true;

    // Trampolines use default dimensions from the class
    const updatedTrampolines = level.trampolines.filter(t => !isPointInElement({ x, y }, t, { width: Trampoline.defaultWidth, height: Trampoline.defaultHeight }));
    if (updatedTrampolines.length !== level.trampolines.length) changed = true;

    // Check portals based on their main body (using default or instance size)
    const updatedPortals = level.portals.filter(p => !isPointInElement({ x, y }, p, { width: p.width || 40, height: p.height || 60 }));
    if (updatedPortals.length !== level.portals.length) changed = true;

    const updatedLevel = { ...level };

    // Check player start (using fixed size)
    if (level.playerStart && isPointInElement({ x, y }, level.playerStart, { width: 40, height: 40 })) {
       updatedLevel.playerStart = { x: 50, y: 450 }; // Reset to default
       changed = true;
    }

    // Check goal (using default dimensions from the class)
    if (level.goal && isPointInElement({ x, y }, level.goal, { width: Goal.defaultWidth, height: Goal.defaultHeight })) {
       updatedLevel.goal = null; // Remove goal, user must place a new one
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
  };

  const placeElement = (x, y) => {
    if (!level || !selectedElement) return;

    const elementColor = isInverted ? 'black' : 'white';
    let newElement;

    // Adjust position to center element roughly under cursor or align top-left
    // Round coordinates to avoid sub-pixel issues if necessary
    const placeX = Math.round(x);
    const placeY = Math.round(y);

    switch (selectedElement) {
      case 'platform':
        // Use platformSize state for dimensions
        newElement = new Platform({ x: placeX, y: placeY, width: platformSize.width, height: platformSize.height, color: elementColor });
        setLevel(prevLevel => ({
            ...prevLevel,
            platforms: [...prevLevel.platforms, newElement]
        }));
        setHasUnsavedChanges(true);
        break;
      case 'spike':
        // Use default dimensions from Spike class
        newElement = new Spike({ x: placeX, y: placeY, color: elementColor });
        setLevel(prevLevel => ({
            ...prevLevel,
            obstacles: [...prevLevel.obstacles, newElement]
        }));
        setHasUnsavedChanges(true);
        break;
      case 'trampoline':
         newElement = new Trampoline({ x: placeX, y: placeY, color: elementColor });
          setLevel(prevLevel => ({
              ...prevLevel,
              trampolines: [...prevLevel.trampolines, newElement]
          }));
         setHasUnsavedChanges(true);
         break;
      case 'portal':
        if (isSelectingPortalDestination && pendingPortal) {
          // Place the destination for the pending portal
          const finalPortal = new Portal({
            ...pendingPortal,
            destination: { x: placeX, y: placeY }, // Use adjusted coords
            portalId: portalCounter // Use current counter
          });
          setLevel(prevLevel => ({
            ...prevLevel,
            portals: [...prevLevel.portals, finalPortal]
          }));
          setHasUnsavedChanges(true);
          setIsSelectingPortalDestination(false);
          setPendingPortal(null);
          setPortalCounter(prev => prev + 1); // Increment for the next portal pair
        } else {
          // Start placing a new portal - store its initial position
          const newPortalBase = {
            x: placeX, // Use adjusted coords
            y: placeY,
            color: 'purple', // Portals have a fixed color for now
            width: 40,
            height: 60,
            portalId: portalCounter // Assign current ID
          };
          setPendingPortal(newPortalBase);
          setIsSelectingPortalDestination(true); // Enter destination selection mode
        }
        break;
      case 'goal':
        newElement = new Goal({ x: placeX, y: placeY }); // Use adjusted coords
         // Only allow one goal - replace existing if any
        setLevel(prevLevel => ({
            ...prevLevel,
            goal: newElement
        }));
        setHasUnsavedChanges(true);
        break;
      case 'player-start':
         // Only allow one start point - replace existing if any
        setLevel(prevLevel => ({
            ...prevLevel,
            playerStart: { x: placeX, y: placeY } // Use adjusted coords
        }));
        setHasUnsavedChanges(true);
        break;
      default:
        break;
    }
  };

  const handleCanvasContextMenu = (e) => {
    e.preventDefault(); // Prevent default browser context menu
    if (isSelectingPortalDestination) {
      // Cancel portal placement on right-click
      setIsSelectingPortalDestination(false);
      setPendingPortal(null);
      // Do not increment portalCounter here
    }
     // Could add other right-click actions like deselecting element
     // setSelectedElement(null);
  };

  const handleCanvasMouseMove = (e) => {
    if (editorMode !== 'place' || !selectedElement || isSelectingPortalDestination) {
      setPreviewElement(null);
      return;
    }

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left + canvas.scrollLeft;
    const y = e.clientY - rect.top + canvas.scrollTop;
    const elementColor = isInverted ? 'black' : 'white';

    let previewProps = { x, y, color: elementColor, type: selectedElement };

    switch (selectedElement) {
      case 'platform':
        previewProps.width = platformSize.width;
        previewProps.height = platformSize.height;
        break;
      case 'spike':
        previewProps.width = Spike.defaultWidth;
        previewProps.height = Spike.defaultHeight;
        break;
      case 'trampoline':
        previewProps.width = Trampoline.defaultWidth;
        previewProps.height = Trampoline.defaultHeight;
        break;
      case 'portal':
        previewProps.width = 40;
        previewProps.height = 60;
        previewProps.color = 'purple';
        break;
      case 'goal':
        previewProps.width = Goal.defaultWidth;
        previewProps.height = Goal.defaultHeight;
        previewProps.color = isInverted ? 'black' : 'white'; // Goal color matches theme
        break;
      case 'player-start':
        previewProps.width = 40; // Player size
        previewProps.height = 40;
        break;
      default:
        setPreviewElement(null);
        return;
    }
    setPreviewElement(previewProps);
  };

  const handleCanvasMouseLeave = () => {
    setPreviewElement(null); // Hide preview when mouse leaves canvas
  };


  // --- Save, Export, Import Handlers --- (No changes needed in logic)
  const handleSave = () => {
    if (!level) return;
    // If level has no name yet, or it's a new level, open dialog
    if (!level.name || level.name === 'Untitled Level' || levelId === 'new') {
       setLevelName(level.name === 'Untitled Level' ? '' : level.name || '');
      setSaveDialogOpen(true);
      return;
    }
    // Otherwise, save directly using the current levelId
    const savedLevelId = saveUserLevel(level, levelId);
    if (savedLevelId) {
      setHasUnsavedChanges(false);
      // Optionally show a success message
      // navigate(`/level-editor/${savedLevelId}`); // Stay on page?
    } else {
      alert("Error al guardar el nivel.");
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
    // If levelId is 'new', pass null to saveUserLevel to generate a new ID
    const idToSaveUnder = levelId === 'new' ? null : levelId;
    const savedLevelId = saveUserLevel(levelToSave, idToSaveUnder);

    if (savedLevelId) {
      setSaveDialogOpen(false);
      setHasUnsavedChanges(false);
      // If it was a new level, navigate to the edit page of the newly saved level
      if (levelId === 'new') {
        navigate(`/level-editor/${savedLevelId}`, { replace: true }); // Replace history entry
      } else {
        // If editing existing, maybe just close dialog or show success
      }
    } else {
      alert("Error al guardar el nivel.");
    }
  };

  const handleExport = () => {
    if (!level) return;
    const levelToExport = { ...level, name: levelName || level.name || 'untitled-level' };
    const levelData = JSON.stringify(levelToExport, null, 2);
    const blob = new Blob([levelData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${levelToExport.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
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
          const importedLevelData = JSON.parse(event.target.result);
          // Basic validation
          if (!importedLevelData || typeof importedLevelData.playerStart !== 'object') {
              throw new Error("Invalid level file structure. Missing playerStart.");
          }
          // Goal can be null, but check if it exists and is an object
          if ('goal' in importedLevelData && importedLevelData.goal !== null && typeof importedLevelData.goal !== 'object') {
              throw new Error("Invalid level file structure. Invalid goal format.");
          }


           // Recreate class instances
          const reconstructedLevel = {
              ...createEmptyLevel(), // Start with defaults
              ...importedLevelData, // Override with imported data
              id: levelId === 'new' ? `imported_${Date.now()}` : levelId, // Keep current ID if editing, else generate temp
              name: importedLevelData.name || 'Imported Level',
              platforms: (importedLevelData.platforms || []).map(p => new Platform(p)),
              obstacles: (importedLevelData.obstacles || []).map(o => new Spike(o)),
              trampolines: (importedLevelData.trampolines || []).map(t => new Trampoline(t)),
              portals: (importedLevelData.portals || []).map(p => new Portal(p)),
              goal: importedLevelData.goal ? new Goal(importedLevelData.goal) : null, // Handle null goal
              playerStart: importedLevelData.playerStart || { x: 50, y: 450 }
          };

          setLevel(reconstructedLevel);
          setLevelName(reconstructedLevel.name);
          setHasUnsavedChanges(true); // Mark as unsaved after import
          // Recalculate portal counter
          const maxPortalId = Math.max(0, ...(reconstructedLevel.portals || []).map(p => p.portalId || 0));
          setPortalCounter(maxPortalId + 1);

        } catch (error) {
          console.error("Error importing level:", error);
          alert(`Error al importar el nivel: ${error.message}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };


  // --- Render ---
  if (!level) {
    // Basic loading state
    return <EditorContainer isInverted={isInverted}><div>Cargando editor...</div></EditorContainer>;
  }

  const oppositeColor = getInactiveColor(isInverted);
  const currentColor = getActiveColor(isInverted);

  return (
    <EditorContainer isInverted={isInverted}>
       {/* ... EditorToolbar ... */}
       <EditorToolbar>
        {/* BackArrow uses handleGoBack */}
        <div style={{ position: 'absolute', left: 'clamp(5px, 1vw, 10px)', top: '50%', transform: 'translateY(-50%)' }}>
          <BackArrow onClick={handleGoBack} />
        </div>

        {/* Central Toolbar Items */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'clamp(5px, 1vw, 10px)', flexGrow: 1, margin: '0 50px' /* Add margin to avoid overlap with side buttons */ }}>
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
            // style={{ marginLeft: '20px' }} // Use gap instead
          >
            Invertir (E)
          </ToolbarItem>
        </div>

        {/* Right Toolbar Items */}
        <div style={{ position: 'absolute', right: 'clamp(10px, 2vw, 15px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 'clamp(5px, 1vw, 10px)' }}>
           <ToolbarItem onClick={handleExport} isInverted={isInverted}>
            Exportar
          </ToolbarItem>
          <ToolbarItem onClick={handleImport} isInverted={isInverted}>
            Importar
          </ToolbarItem>
          <ToolbarItem onClick={handleSave} isInverted={isInverted} disabled={!hasUnsavedChanges && levelId !== 'new'}>
            Guardar {hasUnsavedChanges ? '*' : ''}
          </ToolbarItem>
        </div>
      </EditorToolbar>

      {/* Use EditorMainArea to contain Canvas and Sidebar */}
      <EditorMainArea>
        <EditorCanvas
          onClick={handleCanvasClick}
          onContextMenu={handleCanvasContextMenu}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={handleCanvasMouseLeave}
          isInverted={isInverted}
        >
          {/* Render Grid Lines (Optional) */}
          {/* ... */}

          {/* Render level elements */}
          {level.platforms.map((platform, index) => (
            <div key={`platform-${index}`} style={{ position: 'absolute', left: platform.x, top: platform.y, width: platform.width, height: platform.height, backgroundColor: platform.color === currentColor ? platform.color : 'transparent', border: `1px solid ${platform.color === 'black' ? 'white' : 'black'}`, boxSizing: 'border-box', opacity: platform.color === currentColor ? 1 : 0.3 }} />
          ))}
          {level.obstacles.map((obstacle, index) => {
            // Define style object separately for clarity and to potentially fix parsing issue
            const shadowColor = obstacle.color === 'black' ? 'white' : 'black';
            const obstacleStyle = {
              position: 'absolute',
              left: obstacle.x,
              top: obstacle.y,
              width: 0,
              height: 0,
              borderLeft: `${(obstacle.width || Spike.defaultWidth) / 2}px solid transparent`, // Use default if undefined
              borderRight: `${(obstacle.width || Spike.defaultWidth) / 2}px solid transparent`, // Use default if undefined
              borderBottom: `${(obstacle.height || Spike.defaultHeight)}px solid ${obstacle.color}`, // Use default if undefined
              opacity: obstacle.color === currentColor ? 1 : 0.3,
              filter: `drop-shadow(0px 0px 1px ${shadowColor})`
            };
            return <div key={`obstacle-${index}`} style={obstacleStyle} />;
          })}
          {level.trampolines.map((trampoline, index) => (
            <div key={`trampoline-${index}`} style={{ position: 'absolute', left: trampoline.x, top: trampoline.y, width: trampoline.width || Trampoline.defaultWidth, height: trampoline.height || Trampoline.defaultHeight, backgroundColor: trampoline.color === currentColor ? trampoline.color : 'transparent', border: `1px solid ${trampoline.color === 'black' ? 'white' : 'black'}`, borderRadius: '50% 50% 0 0', opacity: trampoline.color === currentColor ? 1 : 0.3 }} />
          ))}
          {level.portals.map((portal, index) => (
            <React.Fragment key={`portal-${index}`}>
              {/* Portal Body */}
              <div style={{ position: 'absolute', left: portal.x, top: portal.y, width: portal.width || 40, height: portal.height || 60, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${(portal.width || 40) * 0.5}px`, fontWeight: 'bold' }}>{portal.portalId}</div>
              {/* Portal Destination Indicator */}
              {portal.destination && (
                <div style={{ position: 'absolute', left: portal.destination.x, top: portal.destination.y, width: 20, height: 20, border: '2px dashed purple', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.6, color: 'purple', fontSize: '12px', fontWeight: 'bold' }}>{portal.portalId}</div>
              )}
            </React.Fragment>
          ))}
          {/* Goal */}
          {level.goal && (
             <div style={{ position: 'absolute', left: level.goal.x, top: level.goal.y, width: level.goal.width || Goal.defaultWidth, height: level.goal.height || Goal.defaultHeight, border: `3px dashed ${currentColor}`, borderRadius: '50%', opacity: 0.7 }} />
           )}
           {/* Player Start */}
          {level.playerStart && (
             <div style={{ position: 'absolute', left: level.playerStart.x, top: level.playerStart.y, width: 40, height: 40, backgroundColor: currentColor, opacity: 0.5 }} />
           )}

          {/* Preview Element */}
          {previewElement && previewElement.type === 'spike' && (
             <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: 0, height: 0, borderLeft: `${previewElement.width / 2}px solid transparent`, borderRight: `${previewElement.width / 2}px solid transparent`, borderBottom: `${previewElement.height}px solid ${previewElement.color}`, opacity: 0.5, pointerEvents: 'none' }} />
           )}
           {previewElement && previewElement.type === 'trampoline' && (
              <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: previewElement.width, height: previewElement.height, backgroundColor: previewElement.color || 'transparent', borderRadius: '50% 50% 0 0', opacity: 0.5, border: `1px dashed ${previewElement.color === 'black' ? 'white' : 'black'}`, pointerEvents: 'none' }} />
           )}
           {previewElement && !['spike', 'trampoline'].includes(previewElement.type) && (
             <div style={{ position: 'absolute', left: previewElement.x, top: previewElement.y, width: previewElement.width, height: previewElement.height, backgroundColor: previewElement.type === 'player-start' || previewElement.type === 'platform' ? previewElement.color : 'transparent', opacity: 0.5, border: `2px dashed ${previewElement.type === 'goal' ? currentColor : (previewElement.type === 'portal' ? 'purple' : (previewElement.color === 'black' ? 'white' : 'black'))}`, borderRadius: previewElement.type === 'goal' ? '50%' : (previewElement.type === 'portal' ? '8px' : '0'), pointerEvents: 'none' }} />
           )}

           {/* Portal placement UI */}
           {isSelectingPortalDestination && (
             <div style={{ position: 'fixed', top: 0, left: 0, right: 0, backgroundColor: getActiveColor(isInverted), color: getInactiveColor(isInverted), padding: 'clamp(8px, 1.5vh, 10px)', textAlign: 'center', zIndex: 100, opacity: 0.9, fontSize: 'clamp(0.8rem, 2vw, 1rem)' }}>
               Haz clic para establecer el destino del portal {portalCounter}, o clic derecho para cancelar.
             </div>
           )}
           {/* Show the first portal placement while selecting destination */}
           {pendingPortal && (
             <div style={{ position: 'absolute', left: pendingPortal.x, top: pendingPortal.y, width: pendingPortal.width, height: pendingPortal.height, backgroundColor: 'purple', border: '1px solid white', opacity: 0.8, borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: `${pendingPortal.width * 0.5}px`, fontWeight: 'bold' }}>{pendingPortal.portalId}</div>
           )}
        </EditorCanvas>

        {/* ... EditorSidebar ... */}
        <EditorSidebar
          isInverted={isInverted}
          isCollapsed={isSmallScreen ? isSidebarCollapsed : false} /* Only collapse on small screens */
        >
            <SidebarTitle isInverted={isInverted}>Elementos</SidebarTitle>
           <ElementsContainer>
             {/* Element Buttons */}
            <ElementButton onClick={() => { setSelectedElement('platform'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'platform'} isInverted={isInverted}>
                 <span className="element-icon">
                    <div style={{ width: '30px', height: '10px', backgroundColor: oppositeColor, border: `1px solid ${currentColor}` }}></div>
                 </span>
                 Plataforma
            </ElementButton>
            <ElementButton onClick={() => { setSelectedElement('spike'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'spike'} isInverted={isInverted}>
                 <span className="element-icon">
                   <div style={{ width: '30px', height: '20px', position: 'relative' }}>
                     <div style={{ position: 'absolute', width: 0, height: 0, left: 0, bottom: 0, borderLeft: '15px solid transparent', borderRight: '15px solid transparent', borderBottom: `20px solid ${oppositeColor}`, filter: `drop-shadow(0px 0px 1px ${currentColor})` }}></div>
                   </div>
                 </span>
                 Pico
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('trampoline'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'trampoline'} isInverted={isInverted}>
               <span className="element-icon">
                 <div style={{ width: '30px', height: '15px', backgroundColor: oppositeColor, borderRadius: '15px 15px 0 0', border: `1px solid ${currentColor}` }}></div>
               </span>
               Trampolín
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('portal'); /* Don't reset portal state here */ }} isSelected={selectedElement === 'portal'} isInverted={isInverted}>
               <span className="element-icon">
                 <div style={{ width: '30px', height: '30px', backgroundColor: 'purple', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.8, border: '1px solid white' }}><span style={{ color: 'white', fontSize: '16px' }}>◊</span></div>
               </span>
               Portal
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('goal'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'goal'} isInverted={isInverted}>
               <span className="element-icon">
                 <div style={{ width: '20px', height: '20px', border: `2px dashed ${currentColor}`, borderRadius: '50%' }}></div>
               </span>
               Meta
             </ElementButton>
             <ElementButton onClick={() => { setSelectedElement('player-start'); setIsSelectingPortalDestination(false); }} isSelected={selectedElement === 'player-start'} isInverted={isInverted}>
                <span className="element-icon">
                  <div style={{ width: '20px', height: '20px', backgroundColor: currentColor, opacity: 0.7 }}></div>
                </span>
                Inicio Jugador
             </ElementButton>
           </ElementsContainer>

           {/* Platform Size Controls */}
           {selectedElement === 'platform' && (
             <div style={{ marginTop: 'clamp(15px, 3vh, 20px)', padding: 'clamp(8px, 1.5vh, 10px)', border: `1px solid ${currentColor}50`, borderRadius: '5px' }}>
               <h3 style={{ color: currentColor, marginBottom: 'clamp(8px, 1.5vh, 10px)', fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)' }}>Tamaño Plataforma</h3>
               <div style={{ marginBottom: 'clamp(8px, 1.5vh, 10px)' }}>
                 <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Ancho: {platformSize.width}px</label>
                 <input type="range" min="20" max="500" value={platformSize.width} onChange={(e) => setPlatformSize(prev => ({ ...prev, width: Number(e.target.value) }))} style={{ width: '100%' }} />
               </div>
               <div>
                 <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>Alto: {platformSize.height}px</label>
                 <input type="range" min="10" max="100" value={platformSize.height} onChange={(e) => setPlatformSize(prev => ({ ...prev, height: Number(e.target.value) }))} style={{ width: '100%' }} />
               </div>
             </div>
           )}
        </EditorSidebar>
      </EditorMainArea>

       {/* ... Rest of the component ... */}
       {/* Sidebar Toggle Button (visible only on small screens) */}
       <SidebarToggleButton
         onClick={toggleSidebar}
         isInverted={isInverted}
       >
         {isSidebarCollapsed ? '☰' : '✕'} {/* Simple icons */}
       </SidebarToggleButton>


      {/* --- Save Dialog --- */}
      {saveDialogOpen && (
        <SaveDialog>
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
                          handleSaveConfirm();
                      } else if (e.key === 'Escape') {
                          setSaveDialogOpen(false);
                      }
                  }}
                />
                <SaveDialogButtons isInverted={isInverted}>
                  <button onClick={() => setSaveDialogOpen(false)}>Cancelar</button>
                  <button onClick={handleSaveConfirm} disabled={!levelName.trim()}>Guardar</button>
                </SaveDialogButtons>
            </SaveDialogContent>
        </SaveDialog>
      )}

      {/* --- Exit Confirmation Modal --- */}
      <ConfirmationModal
        isOpen={isExitConfirmModalOpen}
        onClose={handleCancelExit}
        onConfirm={handleConfirmExit}
        message="¿Estás seguro de que quieres salir? Los cambios no guardados se perderán."
        isInverted={isInverted}
      />

    </EditorContainer>
  );
};

export default LevelEditor;
// --- END OF FILE LevelEditor.jsx ---