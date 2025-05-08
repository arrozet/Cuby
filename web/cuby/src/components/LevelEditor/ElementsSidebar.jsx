import React from 'react';
import {
    EditorSidebar, // Reutilizamos el styled-component
    SidebarTitle,    // Reutilizamos el styled-component
    ElementsContainer, // Reutilizamos el styled-component
    ElementButton,   // Reutilizamos el styled-component
} from './LevelEditor.styles';
import { getActiveColor, getInactiveColor } from '../../utils/colors'; // Necesario para colores en botones

const ElementsSidebar = ({
    selectedElement,
    editorMode,
    onSelectElement,
    platformSize,
    onPlatformSizeChange,
    isInverted,
    // No necesitamos pasar currentColor y oppositeColor, los podemos derivar de isInverted
}) => {
    const currentColor = getActiveColor(isInverted);
    const oppositeColor = getInactiveColor(isInverted);

    return (
        <EditorSidebar isInverted={isInverted}>
            <SidebarTitle isInverted={isInverted}>Elementos</SidebarTitle>
            <ElementsContainer>
                <ElementButton
                    onClick={() => onSelectElement('platform')}
                    isSelected={selectedElement === 'platform' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <div>
                        <div
                            style={{
                                width: '30px',
                                height: '10px',
                                backgroundColor: oppositeColor,
                                border: `1px solid ${currentColor}`,
                            }}
                        ></div>
                    </div>
                    Plataforma
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('spike')}
                    isSelected={selectedElement === 'spike' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <div>
                        <div style={{ width: '30px', height: '20px', position: 'relative' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    width: 0,
                                    height: 0,
                                    left: 0,
                                    bottom: 0,
                                    borderLeft: '15px solid transparent',
                                    borderRight: '15px solid transparent',
                                    borderBottom: `20px solid ${oppositeColor}`,
                                    filter: `drop-shadow(0px 0px 1px ${currentColor})`,
                                }}
                            ></div>
                        </div>
                    </div>
                    Pico
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('trampoline')}
                    isSelected={selectedElement === 'trampoline' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <div>
                        <div
                            style={{
                                width: '30px',
                                height: '15px',
                                backgroundColor: oppositeColor,
                                borderRadius: '15px 15px 0 0',
                                border: `1px solid ${currentColor}`,
                            }}
                        ></div>
                    </div>
                    Trampolín
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('portal')}
                    isSelected={selectedElement === 'portal' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <div>
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: 'purple',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                opacity: 0.8,
                                border: '1px solid white',
                            }}
                        >
                            <span style={{ color: 'white', fontSize: '16px' }}>◊</span>
                        </div>
                    </div>
                    Portal
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('goal')}
                    isSelected={selectedElement === 'goal' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <div>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                border: `2px dashed ${currentColor}`,
                                borderRadius: '50%',
                            }}
                        ></div>
                    </div>
                    Meta
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('player-start')}
                    isSelected={selectedElement === 'player-start' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <div>
                        <div
                            style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: currentColor,
                                opacity: 0.7,
                            }}
                        ></div>
                    </div>
                    Inicio Jugador
                </ElementButton>
            </ElementsContainer>
            {selectedElement === 'platform' && editorMode === 'place' && (
                <div style={{ marginTop: '20px', padding: '10px', border: `1px solid ${currentColor}50`, borderRadius: '5px' }}>
                    <h3 style={{ color: currentColor, marginBottom: '10px', fontSize: '16px' }}>
                        Tamaño Plataforma
                    </h3>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                            Ancho: {platformSize.width}px
                        </label>
                        <input
                            type="range"
                            min="20"
                            max="500"
                            value={platformSize.width}
                            onChange={(e) => onPlatformSizeChange(prev => ({ ...prev, width: Number(e.target.value) }))}
                            style={{ width: '100%' }}
                        />
                    </div>
                    <div>
                        <label style={{ color: currentColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                            Alto: {platformSize.height}px
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={platformSize.height}
                            onChange={(e) => onPlatformSizeChange(prev => ({ ...prev, height: Number(e.target.value) }))}
                            style={{ width: '100%' }}
                        />
                    </div>
                </div>
            )}
        </EditorSidebar>
    );
};

export default ElementsSidebar; 