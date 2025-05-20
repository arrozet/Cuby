import React from 'react';
import {
    SaveDialog,
    SaveDialogContent,
    SaveDialogButtons,
} from './LevelEditor.styles';

const ExportLevelDialog = ({
    isOpen,
    onClose,
    exportCode,
    isInverted,
}) => {
    if (!isOpen) return null;

    return (
        <SaveDialog onClick={onClose}>
            <SaveDialogContent isInverted={isInverted} onClick={(e) => e.stopPropagation()}>
                <h2>Exportar Nivel</h2>
                <p>Código del nivel copiado al portapapeles:</p>
                <div 
                    style={{ 
                        backgroundColor: isInverted ? '#222' : '#f5f5f5',
                        color: isInverted ? '#f5f5f5' : '#333',
                        padding: '10px',
                        borderRadius: '4px',
                        maxHeight: '150px',
                        overflowY: 'auto',
                        wordBreak: 'break-all',
                        marginBottom: '15px',
                        fontFamily: 'monospace',
                        fontSize: '14px'
                    }}
                >
                    {exportCode}
                </div>
                <SaveDialogButtons isInverted={isInverted}>
                    <button onClick={onClose}>Cerrar</button>
                </SaveDialogButtons>
            </SaveDialogContent>
        </SaveDialog>
    );
};

export default ExportLevelDialog;
