import React from 'react';
import {
    EditorSidebar,
    SidebarTitle,
    ElementsContainer,
    ElementButton,
    PlatformIcon,
    SpikeIconContainer,
    SpikeIconShape,
    TrampolineIcon,
    PortalIconVisual,
    PortalSymbol,
    GoalIcon,
    PlayerStartIcon,
} from './LevelEditor.styles';
import { getActiveColor, getInactiveColor } from '../../utils/colors';

const ElementsSidebar = ({
    selectedElement,
    editorMode,
    onSelectElement,
    platformSize,
    onPlatformSizeChange,
    isInverted,
}) => {
    const activeColor = getActiveColor(isInverted);
    const inactiveColor = getInactiveColor(isInverted);

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
                    <PlatformIcon color={activeColor} borderColor={activeColor} />
                    Plataforma
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('spike')}
                    isSelected={selectedElement === 'spike' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <SpikeIconContainer>
                        <SpikeIconShape fillColor={activeColor} outlineColor={activeColor} />
                    </SpikeIconContainer>
                    Pico
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('trampoline')}
                    isSelected={selectedElement === 'trampoline' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <TrampolineIcon color={activeColor} borderColor={activeColor} />
                    Trampolín
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('portal')}
                    isSelected={selectedElement === 'portal' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <PortalIconVisual color={activeColor} borderColor={activeColor}>
                        <PortalSymbol color={inactiveColor}>◊</PortalSymbol>
                    </PortalIconVisual>
                    Portal
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('goal')}
                    isSelected={selectedElement === 'goal' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <GoalIcon color={activeColor} />
                    Meta
                </ElementButton>
                <ElementButton
                    onClick={() => onSelectElement('player-start')}
                    isSelected={selectedElement === 'player-start' && editorMode === 'place'}
                    isInverted={isInverted}
                    disabled={editorMode === 'pan'}
                >
                    <PlayerStartIcon color={activeColor} />
                    Inicio Jugador
                </ElementButton>
            </ElementsContainer>
            {selectedElement === 'platform' && editorMode === 'place' && (
                <div style={{ marginTop: '20px', padding: '10px', border: `1px solid ${activeColor}50`, borderRadius: '5px' }}>
                    <h3 style={{ color: activeColor, marginBottom: '10px', fontSize: '16px' }}>
                        Tamaño Plataforma
                    </h3>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ color: activeColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>
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
                        <label style={{ color: activeColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>
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