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

const DualColorOption = ({ activeColor, platformSize, onPlatformSizeChange }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
            type="checkbox"
            id="Colocar en ambos colores"
            checked={!!platformSize.dualColor}
            onChange={e => onPlatformSizeChange({ ...platformSize, dualColor: e.target.checked })}
            style={{ marginRight: '8px' }}
        />
        <label htmlFor="Colocar en ambos colores" style={{ color: activeColor, fontSize: '14px', userSelect: 'none', cursor: 'pointer' }}>
            Colocar en ambos colores
        </label>
    </div>
);

const ElementsSidebar = ({
    selectedElement,
    onSelectElement,
    platformSize,
    onPlatformSizeChange,
    $isInverted,
}) => {
    const activeColor = getActiveColor($isInverted);
    const inactiveColor = getInactiveColor($isInverted);

    return (
        <EditorSidebar $isInverted={$isInverted}>
            <SidebarTitle $isInverted={$isInverted}>Elementos</SidebarTitle>
            <ElementsContainer>
                <ElementButton
                    $isSelected={selectedElement === 'platform'}
                    onClick={() => onSelectElement('platform')}
                    $isInverted={$isInverted}
                >
                    <PlatformIcon color={activeColor} $borderColor={inactiveColor} />
                    Plataforma
                </ElementButton>
                {selectedElement === 'platform' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', border: `1px solid ${activeColor}50`, borderRadius: '5px' }}>
                        <h3 style={{ color: activeColor, marginBottom: '10px', fontSize: '16px' }}>
                            Tamaño de plataforma
                        </h3>
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="Anchura de plataforma" style={{ color: activeColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                Ancho: {platformSize.width}px
                            </label>
                            <input
                                id="Anchura de plataforma"
                                type="range"
                                min="20"
                                max="500"
                                value={platformSize.width}
                                onChange={(e) => onPlatformSizeChange({ ...platformSize, width: Number(e.target.value) })}
                                aria-valuemin="20"
                                aria-valuemax="500"
                                aria-valuenow={platformSize.width}
                                aria-labelledby="Anchura de plataforma"
                                style={{
                                    width: '100%',
                                    accentColor: activeColor,
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>
                        <div>
                            <label htmlFor="Altura de plataforma" style={{ color: activeColor, display: 'block', marginBottom: '5px', fontSize: '14px' }}>
                                Alto: {platformSize.height}px
                            </label>
                            <input
                                id="Altura de plataforma"
                                type="range"
                                min="10"
                                max="500"
                                value={platformSize.height}
                                onChange={(e) => onPlatformSizeChange({ ...platformSize, height: Number(e.target.value) })}
                                aria-valuemin="10"
                                aria-valuemax="500"
                                aria-valuenow={platformSize.height}
                                aria-labelledby="Altura de plataforma"
                                style={{
                                    width: '100%',
                                    accentColor: activeColor,
                                    backgroundColor: 'transparent'
                                }}
                            />
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <DualColorOption 
                                activeColor={activeColor}
                                platformSize={platformSize}
                                onPlatformSizeChange={onPlatformSizeChange}
                            />
                        </div>
                    </div>
                )}
                <ElementButton
                    $isSelected={selectedElement === 'spike'}
                    onClick={() => onSelectElement('spike')}
                    $isInverted={$isInverted}
                >
                    <SpikeIconContainer>
                        <SpikeIconShape $fillColor={activeColor} $outlineColor={inactiveColor} />
                    </SpikeIconContainer>
                    Pico
                </ElementButton>
                {selectedElement === 'spike' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', border: `1px solid ${activeColor}50`, borderRadius: '5px' }}>
                        <DualColorOption 
                            activeColor={activeColor}
                            platformSize={platformSize}
                            onPlatformSizeChange={onPlatformSizeChange}
                        />
                    </div>
                )}
                <ElementButton
                    $isSelected={selectedElement === 'trampoline'}
                    onClick={() => onSelectElement('trampoline')}
                    $isInverted={$isInverted}
                >
                    <TrampolineIcon color={activeColor} $borderColor={inactiveColor} />
                    Trampolín
                </ElementButton>
                {selectedElement === 'trampoline' && (
                    <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px', border: `1px solid ${activeColor}50`, borderRadius: '5px' }}>
                        <DualColorOption 
                            activeColor={activeColor}
                            platformSize={platformSize}
                            onPlatformSizeChange={onPlatformSizeChange}
                        />
                    </div>
                )}
                <ElementButton
                    $isSelected={selectedElement === 'portal'}
                    onClick={() => onSelectElement('portal')}
                    $isInverted={$isInverted}
                >
                    <PortalIconVisual color={activeColor} $borderColor={inactiveColor}>
                        <PortalSymbol color={inactiveColor}>◊</PortalSymbol>
                    </PortalIconVisual>
                    Portal
                </ElementButton>
                <ElementButton
                    $isSelected={selectedElement === 'goal'}
                    onClick={() => onSelectElement('goal')}
                    $isInverted={$isInverted}
                >
                    <GoalIcon color={activeColor} />
                    Meta
                </ElementButton>
                <ElementButton
                    $isSelected={selectedElement === 'player-start'}
                    onClick={() => onSelectElement('player-start')}
                    $isInverted={$isInverted}
                >
                    <PlayerStartIcon color={activeColor} />
                    Inicio del jugador
                </ElementButton>
            </ElementsContainer>
        </EditorSidebar>
    );
};

export default ElementsSidebar;