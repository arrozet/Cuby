import React from 'react';
import BackArrow from '../common/BackArrow/BackArrow'; // Ajusta la ruta si es necesario
import {
    EditorToolbar, // Reutilizamos el styled-component
    ToolbarItem,   // Reutilizamos el styled-component
    ToolbarGroup,  // Reutilizamos el styled-component
} from './LevelEditor.styles'; // Asumiendo que aquí están los estilos

const Toolbar = ({
    editorMode,
    onSetMode,
    onToggleInversion,
    onExportLevel,
    onImportLevel,
    onSaveLevel,
    onGoBack,
    hasUnsavedChanges,
    isLevelLoaded, // Para deshabilitar "Guardar"
    isInverted,
}) => {
    return (
        <EditorToolbar>
            <ToolbarGroup className="left-group">
                <BackArrow onClick={onGoBack} />
            </ToolbarGroup>
            <ToolbarGroup className="center-group">
                <ToolbarItem
                    $isActive={editorMode === 'place'}
                    onClick={() => onSetMode('place')}
                    $isInverted={isInverted}
                >
                    Colocar
                </ToolbarItem>
                <ToolbarItem
                    $isActive={editorMode === 'erase'}
                    onClick={() => onSetMode('erase')}
                    $isInverted={isInverted}
                >
                    Borrar
                </ToolbarItem>
            </ToolbarGroup>
            <ToolbarGroup className="right-group">
                <ToolbarItem onClick={onToggleInversion} $isInverted={isInverted}>
                    Invertir
                </ToolbarItem>
                <ToolbarItem onClick={onExportLevel} $isInverted={isInverted}>
                    Exportar
                </ToolbarItem>
                <ToolbarItem onClick={onImportLevel} $isInverted={isInverted}>
                    Importar
                </ToolbarItem>
                <ToolbarItem
                    onClick={onSaveLevel}
                    $isInverted={isInverted}
                    disabled={!isLevelLoaded}
                >
                    Guardar{hasUnsavedChanges ? '*' : ''}
                </ToolbarItem>
            </ToolbarGroup>
        </EditorToolbar>
    );
};

export default Toolbar; 