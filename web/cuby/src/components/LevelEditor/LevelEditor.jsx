import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import BackArrow from '../common/BackArrow/BackArrow';
import { useInversion } from '../../context/InversionContext';
import { Platform, Spike, Trampoline, Portal, Goal } from '../GameElements/GameElements';
import { getUserLevelById, saveUserLevel, createEmptyLevel } from '../../utils/levelManager';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const LevelEditor = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { isInverted, toggleInversion } = useInversion();
  
  // Estado para el nivel que se está editando
  const [level, setLevel] = useState(null);
  
  // Estado para el elemento seleccionado
  const [selectedElement, setSelectedElement] = useState(null);
  
  // Estado para el modo de editor (colocar, borrar)
  const [editorMode, setEditorMode] = useState('place');
  
  // Estado para el diálogo de guardado
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [levelName, setLevelName] = useState('');
  
  // Estado para controlar la tecla E
  const [eKeyPressed, setEKeyPressed] = useState(false);
  
  // Add new state for platform dimensions
  const [platformSize, setPlatformSize] = useState({
    width: 100,
    height: 20
  });

  // In LevelEditor.jsx, add these new states
  const [isSelectingPortalDestination, setIsSelectingPortalDestination] = useState(false);
  const [pendingPortal, setPendingPortal] = useState(null);
  
  // Añade este estado cerca del inicio del componente, junto a los otros estados
  const [portalCounter, setPortalCounter] = useState(1);
  
  // Manejar la inversión con la tecla E
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'e' && !eKeyPressed) {
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
  }, [toggleInversion, eKeyPressed]);
  
  // Carga el nivel si estamos editando, o crea uno nuevo
  useEffect(() => {
    if (levelId === 'new') {
      // Crear un nivel vacío
      setLevel(createEmptyLevel());
    } else {
      // Cargar nivel existente
      const existingLevel = getUserLevelById(levelId);
      if (existingLevel) {
        setLevel(existingLevel);
        setLevelName(existingLevel.name);
      } else {
        // Si no existe, crear uno vacío
        setLevel(createEmptyLevel());
      }
    }
  }, [levelId]);
  
  // Manejar el arrastre y colocación de elementos
  const handleCanvasClick = (e) => {
    // Obtener la posición del clic relativa al canvas
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Modo borrar: eliminar elementos en esa posición sin importar qué esté seleccionado
    if (editorMode === 'erase') {
      eraseElementAt(x, y);
      return;
    }
    
    // Para modo colocar, necesitamos un elemento seleccionado
    if (!selectedElement || !level) return;
    
    // Obtener el color contrario al fondo actual
    const elementColor = getInactiveColor(isInverted);
    
    // Crear el nuevo elemento según el tipo seleccionado
    let newElement;
    
    switch (selectedElement) {
      case 'platform':
        newElement = new Platform({ 
          x, y, 
          color: elementColor, 
          width: platformSize.width, 
          height: platformSize.height 
        });
        setLevel({
          ...level,
          platforms: [...level.platforms, newElement]
        });
        break;
      case 'spike':
        // Corregido: Posicionamos el spike exactamente donde está el cursor
        // El spike necesita que su base esté donde está el cursor, no su punto superior
        newElement = new Spike({ 
          x, 
          y: y - Spike.defaultHeight, // Restamos la altura para que la base esté donde se hizo clic
          color: elementColor 
        });
        setLevel({
          ...level,
          obstacles: [...level.obstacles, newElement]
        });
        break;
      case 'trampoline':
        newElement = new Trampoline({ x, y, color: elementColor });
        setLevel({
          ...level,
          trampolines: [...level.trampolines, newElement]
        });
        break;
      case 'portal':
        if (isSelectingPortalDestination && pendingPortal) {
          // Complete the portal by setting its destination
          const finalPortal = new Portal({ 
            ...pendingPortal,
            destination: { x, y },
            portalId: portalCounter // Añadir ID al portal
          });
          setLevel({
            ...level,
            portals: [...level.portals, finalPortal]
          });
          // Reset portal placement states and increment counter
          setIsSelectingPortalDestination(false);
          setPendingPortal(null);
          setPortalCounter(prev => prev + 1);
        } else {
          // Start portal placement
          const newPortal = {
            x, 
            y, 
            color: elementColor,
            width: 40,
            height: 60,
            portalId: portalCounter // Añadir ID al portal pendiente
          };
          setPendingPortal(newPortal);
          setIsSelectingPortalDestination(true);
        }
        break;
      case 'goal':
        // Reemplazar la meta actual
        newElement = new Goal({ x, y });
        setLevel({
          ...level,
          goal: newElement
        });
        break;
      case 'player-start':
        // Actualizar punto de inicio del jugador
        setLevel({
          ...level,
          playerStart: { x, y }
        });
        break;
      default:
        break;
    }
  };
  
  // Add this new function
  const handleCanvasContextMenu = (e) => {
    e.preventDefault();
    if (isSelectingPortalDestination) {
      setIsSelectingPortalDestination(false);
      setPendingPortal(null);
    }
  };

  // Función para borrar elementos en una posición
  const eraseElementAt = (x, y) => {
    if (!level) return;
    
    // Función auxiliar mejorada para verificar si un punto está dentro de un elemento
    const isPointInElement = (point, element) => {
      // Si el elemento no tiene dimensiones definidas, usar valores predeterminados
      const width = element.width || 40; // Valor por defecto para elementos sin ancho específico
      const height = element.height || 40; // Valor por defecto para elementos sin alto específico
      
      return (
        point.x >= element.x &&
        point.x <= element.x + width &&
        point.y >= element.y &&
        point.y <= element.y + height
      );
    };
    
    // Comprobar y registrar para depuración
    console.log('Intentando borrar en posición:', x, y);
    console.log('Elementos actuales:', {
      platforms: level.platforms.length,
      obstacles: level.obstacles.length,
      trampolines: level.trampolines.length,
      portals: level.portals.length
    });
    
    // También comprobar si el punto de inicio del jugador o la meta están siendo borrados
    const isPlayerStartErased = 
      x >= level.playerStart.x && 
      x <= level.playerStart.x + 40 && 
      y >= level.playerStart.y && 
      y <= level.playerStart.y + 40;
      
    const isGoalErased = isPointInElement({ x, y }, level.goal);
    
    // Filtrar los elementos que no están en la posición del clic
    const updatedPlatforms = level.platforms.filter(
      platform => !isPointInElement({ x, y }, platform)
    );
    
    const updatedObstacles = level.obstacles.filter(
      obstacle => !isPointInElement({ x, y }, obstacle)
    );
    
    const updatedTrampolines = level.trampolines.filter(
      trampoline => !isPointInElement({ x, y }, trampoline)
    );
    
    const updatedPortals = level.portals.filter(
      portal => !isPointInElement({ x, y }, portal)
    );
    
    // Actualizar el nivel con los elementos filtrados
    const updatedLevel = {
      ...level,
      platforms: updatedPlatforms,
      obstacles: updatedObstacles,
      trampolines: updatedTrampolines,
      portals: updatedPortals
    };
    
    // Si se borró la meta, crear una nueva meta en una posición segura
    if (isGoalErased) {
      updatedLevel.goal = new Goal({ x: 700, y: 500 });
    }
    
    // Si se borró el punto de inicio, recolocarlo en una posición segura
    if (isPlayerStartErased) {
      updatedLevel.playerStart = { x: 50, y: 450 };
    }
    
    // Actualizar el nivel con todos los cambios
    setLevel(updatedLevel);
    
    // Registrar resultados para depuración
    console.log('Elementos después del borrado:', {
      platforms: updatedLevel.platforms.length,
      obstacles: updatedLevel.obstacles.length,
      trampolines: updatedLevel.trampolines.length,
      portals: updatedLevel.portals.length
    });
  };
  
  // Manejar guardado de nivel
  const handleSave = () => {
    if (!level) return;
    
    // Si no tiene nombre, mostrar diálogo para introducir nombre
    if (!level.name || level.name === 'Untitled Level') {
      setSaveDialogOpen(true);
      return;
    }
    
    // Si ya tiene nombre, guardar directamente
    const savedLevelId = saveUserLevel(level, levelId === 'new' ? null : levelId);
    if (savedLevelId) {
      navigate('/user-levels');
    }
  };
  
  // Manejar confirmación de guardado con nombre
  const handleSaveConfirm = () => {
    if (!level || !levelName) return;
    
    const levelToSave = {
      ...level,
      name: levelName
    };
    
    const savedLevelId = saveUserLevel(levelToSave, levelId === 'new' ? null : levelId);
    if (savedLevelId) {
      setSaveDialogOpen(false);
      navigate('/user-levels');
    }
  };

  // Añade estas funciones después de handleSaveConfirm:

const handleExport = () => {
  if (!level) return;
  
  const levelData = JSON.stringify(level, null, 2);
  const blob = new Blob([levelData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${level.name || 'untitled-level'}.json`;
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
    reader.onload = (e) => {
      try {
        const importedLevel = JSON.parse(e.target.result);
        
        // Recrear las instancias de las clases correctas
        const reconstructedLevel = {
          ...importedLevel,
          platforms: importedLevel.platforms.map(p => new Platform(p)),
          obstacles: importedLevel.obstacles.map(o => new Spike(o)),
          trampolines: importedLevel.trampolines.map(t => new Trampoline(t)),
          portals: importedLevel.portals.map(p => new Portal(p)),
          goal: new Goal(importedLevel.goal)
        };
        
        setLevel(reconstructedLevel);
        setLevelName(reconstructedLevel.name || '');
        
        // Actualizar el contador de portales
        const maxPortalId = Math.max(
          ...reconstructedLevel.portals.map(p => p.portalId || 0),
          0
        );
        setPortalCounter(maxPortalId + 1);
        
      } catch (error) {
        console.error('Error al importar el nivel:', error);
        alert('Error al importar el nivel. Asegúrate de que el archivo es válido.');
      }
    };
    reader.readAsText(file);
  };

  input.click();
};
  
  // Si el nivel aún no está cargado, mostrar carga
  if (!level) {
    return <div>Cargando editor...</div>;
  }
  
  // Color opuesto al fondo para los elementos
  const oppositeColor = getInactiveColor(isInverted);
  const currentColor = getActiveColor(isInverted);
  
  return (
    <EditorContainer isInverted={isInverted}>
      <EditorToolbar>
        {/* BackArrow a la izquierda, ajustada más hacia arriba */}
        <div style={{ position: 'absolute', left: '5px', top: '-10px', transform: 'translateY(0)' }}>
          <BackArrow onClick={() => navigate('/user-levels')} />
        </div>
        
        {/* Botones centrales */}
        <div style={{ 
          display: 'flex', 
          margin: '0 auto', 
          alignItems: 'center' 
        }}>
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
            style={{ 
              marginLeft: '20px', 
              backgroundColor: 'transparent'
            }}
          >
            Invertir Colores (E)
          </ToolbarItem>
        </div>
        
        {/* Botón de guardar a la derecha */}
        <div style={{ position: 'absolute', right: '15px', display: 'flex', gap: '10px' }}>
          <ToolbarItem 
            onClick={handleExport}
            isInverted={isInverted}
            style={{ backgroundColor: 'transparent' }}
          >
            Exportar
          </ToolbarItem>
          
          <ToolbarItem 
            onClick={handleImport}
            isInverted={isInverted}
            style={{ backgroundColor: 'transparent' }}
          >
            Importar
          </ToolbarItem>
          
          <ToolbarItem 
            onClick={handleSave}
            isInverted={isInverted}
            style={{ backgroundColor: 'transparent' }}
          >
            Guardar Nivel
          </ToolbarItem>
        </div>
      </EditorToolbar>
      
      <div style={{ display: 'flex', flex: 1, width: '100%' }}>
        <EditorCanvas onClick={handleCanvasClick} onContextMenu={handleCanvasContextMenu} isInverted={isInverted}>
          {/* Renderizar aquí el contenido del nivel */}
          {/* Usar el componente Level pero con interactividad adicional */}
          {/* Esta parte es similar a lo que ya tienes en Level.jsx */}
          {/* Renderizado de plataformas */}
          {level.platforms.map((platform, index) => (
            <div
              key={`platform-${index}`}
              style={{
                position: 'absolute',
                left: platform.x,
                top: platform.y,
                width: platform.width,
                height: platform.height,
                // Si el color coincide con el color activo actual, mostrar relleno
                backgroundColor: platform.color === (isInverted ? 'black' : 'white') ? 
                  platform.color : 'transparent',
                // Siempre mostrar un borde del color contrario al de la plataforma
                border: `1px solid ${platform.color === 'black' ? 'white' : 'black'}`,
                boxSizing: 'border-box'
              }}
            />
          ))}
          
          {/* Renderizado de obstáculos (pinchos) */}
          {level.obstacles.map((obstacle, index) => (
            <div
              key={`obstacle-${index}`}
              style={{
                position: 'absolute',
                left: obstacle.x,
                top: obstacle.y,
                width: obstacle.width,
                height: obstacle.height,
                position: 'relative'
              }}
            >
              {/* Triángulo para el pico (spike) */}
              <div style={{
                position: 'absolute',
                width: 0,
                height: 0,
                left: 0,
                top: 0,
                borderLeft: `${obstacle.width / 2}px solid transparent`,
                borderRight: `${obstacle.width / 2}px solid transparent`,
                borderBottom: `${obstacle.height}px solid ${obstacle.color}`,
                opacity: obstacle.color === (isInverted ? 'black' : 'white') ? 1 : 0.3,
                filter: `drop-shadow(0px 0px 1px ${obstacle.color === 'black' ? 'white' : 'black'})`
              }}></div>
            </div>
          ))}
          
          {/* Renderizado de trampolines */}
          {level.trampolines.map((trampoline, index) => (
            <div
              key={`trampoline-${index}`}
              style={{
                position: 'absolute',
                left: trampoline.x,
                top: trampoline.y,
                width: trampoline.width,
                height: trampoline.height,
                backgroundColor: trampoline.color === (isInverted ? 'black' : 'white') ? 
                  trampoline.color : 'transparent',
                // Contorno siempre visible del color contrario
                border: `1px solid ${trampoline.color === 'black' ? 'white' : 'black'}`,
                borderRadius: '50% 50% 0 0',
                opacity: trampoline.color === (isInverted ? 'black' : 'white') ? 1 : 0.3
              }}
            />
          ))}
          
          {/* Renderizado de portales - siempre visibles */}
          {level.portals.map((portal, index) => (
            <React.Fragment key={`portal-${index}`}>
              {/* Portal principal */}
              <div
                style={{
                  position: 'absolute',
                  left: portal.x,
                  top: portal.y,
                  width: portal.width,
                  height: portal.height,
                  backgroundColor: 'purple',
                  border: '1px solid #ffffff',
                  opacity: 0.8,
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <div style={{
                  fontSize: `${portal.width * 0.5}px`,
                  color: 'white',
                  fontWeight: 'bold'
                }}>{portal.portalId}</div>
              </div>
              
              {/* Indicador de destino */}
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
                    opacity: 0.6
                  }}
                >
                  <div style={{
                    fontSize: '12px',
                    color: 'purple',
                    fontWeight: 'bold'
                  }}>{portal.portalId}</div>
                </div>
              )}
            </React.Fragment>
          ))}
          
          {/* Renderizado de la meta */}
          <div
            style={{
              position: 'absolute',
              left: level.goal.x,
              top: level.goal.y,
              width: level.goal.width,
              height: level.goal.height,
              border: `3px dashed ${isInverted ? 'black' : 'white'}`,
              borderRadius: '50%'
            }}
          />
          
          {/* Punto de inicio del jugador */}
          <div
            style={{
              position: 'absolute',
              left: level.playerStart.x,
              top: level.playerStart.y,
              width: 40,
              height: 40,
              backgroundColor: isInverted ? 'black' : 'white',
              opacity: 0.7
            }}
          />
          {isSelectingPortalDestination && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              backgroundColor: getActiveColor(isInverted),
              color: getInactiveColor(isInverted),
              padding: '10px',
              textAlign: 'center',
              zIndex: 100,
              opacity: 0.9
            }}>
              Haz clic en cualquier lugar para establecer el destino del portal, o clic derecho para cancelar.
            </div>
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
                border: '1px solid #ffffff',
                opacity: 0.8,
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <div style={{
                fontSize: `${pendingPortal.width * 0.5}px`,
                color: 'white',
                fontWeight: 'bold'
              }}>{pendingPortal.portalId}</div>
            </div>
          )}
        </EditorCanvas>
        
        <EditorSidebar isInverted={isInverted}>
          <SidebarTitle isInverted={isInverted}>Elementos</SidebarTitle>
          <ElementsContainer>
            <ElementButton 
              onClick={() => setSelectedElement('platform')}
              isSelected={selectedElement === 'platform'}
              isInverted={isInverted}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '30px', 
                  height: '10px', 
                  backgroundColor: oppositeColor, 
                  marginRight: '10px',
                  border: `1px solid ${currentColor}`
                }}></div>
                Plataforma
              </div>
            </ElementButton>
            
            <ElementButton 
              onClick={() => setSelectedElement('spike')}
              isSelected={selectedElement === 'spike'}
              isInverted={isInverted}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '30px', 
                  height: '20px', 
                  marginRight: '10px',
                  position: 'relative'
                }}>
                  {/* Forma de triángulo para el pico */}
                  <div style={{ 
                    position: 'absolute',
                    width: 0,
                    height: 0,
                    left: 0,
                    bottom: 0,
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderBottom: `20px solid ${oppositeColor}`,
                    filter: `drop-shadow(0px 0px 1px ${currentColor})`
                  }}></div>
                </div>
                Pico
              </div>
            </ElementButton>
            
            <ElementButton 
              onClick={() => setSelectedElement('trampoline')}
              isSelected={selectedElement === 'trampoline'}
              isInverted={isInverted}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '30px', 
                  height: '15px', 
                  backgroundColor: oppositeColor, 
                  marginRight: '10px',
                  borderRadius: '15px 15px 0 0',
                  border: `1px solid ${currentColor}`
                }}></div>
                Trampolín
              </div>
            </ElementButton>
            
            <ElementButton 
              onClick={() => setSelectedElement('portal')}
              isSelected={selectedElement === 'portal'}
              isInverted={isInverted}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '30px', 
                  height: '30px', 
                  backgroundColor: 'purple', 
                  marginRight: '10px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  opacity: 0.8,
                  border: '1px solid #ffffff'
                }}>
                  <span style={{ color: 'white', fontSize: '16px' }}>◊</span>
                </div>
                Portal
              </div>
            </ElementButton>
            
            <ElementButton 
              onClick={() => setSelectedElement('goal')}
              isSelected={selectedElement === 'goal'}
              isInverted={isInverted}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  marginRight: '10px',
                  border: `2px dashed ${currentColor}`,
                  borderRadius: '50%'
                }}></div>
                Meta
              </div>
            </ElementButton>
            
            <ElementButton 
              onClick={() => setSelectedElement('player-start')}
              isSelected={selectedElement === 'player-start'}
              isInverted={isInverted}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  backgroundColor: currentColor, 
                  marginRight: '10px',
                  opacity: 0.7
                }}></div>
                Inicio Jugador
              </div>
            </ElementButton>
          </ElementsContainer>
          
          {selectedElement && selectedElement === 'platform' && (
            <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h3 style={{ color: currentColor, marginBottom: '10px' }}>Tamaño de Plataforma</h3>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ color: currentColor, display: 'block', marginBottom: '5px' }}>
                  Ancho: {platformSize.width}px
                </label>
                <input 
                  type="range" 
                  min="20" 
                  max="300" 
                  value={platformSize.width} 
                  onChange={(e) => setPlatformSize(prev => ({ ...prev, width: Number(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ color: currentColor, display: 'block', marginBottom: '5px' }}>
                  Alto: {platformSize.height}px
                </label>
                <input 
                  type="range" 
                  min="10" 
                  max="100" 
                  value={platformSize.height} 
                  onChange={(e) => setPlatformSize(prev => ({ ...prev, height: Number(e.target.value) }))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}
        </EditorSidebar>
      </div>
      
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
            />
            <SaveDialogButtons>
              <button onClick={() => setSaveDialogOpen(false)}>Cancelar</button>
              <button 
                onClick={handleSaveConfirm} 
                disabled={!levelName}
              >
                Guardar
              </button>
            </SaveDialogButtons>
          </SaveDialogContent>
        </SaveDialog>
      )}
    </EditorContainer>
  );
};

export default LevelEditor;