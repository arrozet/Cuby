import React from 'react';
import styled from 'styled-components';
import {
    SaveDialog,
    SaveDialogContent,
    SaveDialogButtons,
} from './LevelEditor.styles';

const CodeContainer = styled.div`
    padding: 10px;
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
    word-break: break-all;
    margin-bottom: 15px;
    font-family: monospace;
    font-size: 14px;
    background-color: ${props => props.$isInverted ? '#222' : '#f5f5f5'};
    color: ${props => props.$isInverted ? '#f5f5f5' : '#333'};
`;

const ExportLevelDialog = ({
    isOpen,
    onClose,
    exportCode,
    isInverted,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <SaveDialog onClick={handleBackdropClick}>
            <SaveDialogContent $isInverted={isInverted} onClick={(e) => e.stopPropagation()}>
                <h2>Exportar Nivel</h2>
                <p>Código del nivel copiado al portapapeles:</p>
                <CodeContainer $isInverted={isInverted}>
                    {exportCode}
                </CodeContainer>
                <SaveDialogButtons $isInverted={isInverted}>
                    <button onClick={onClose}>Cerrar</button>
                </SaveDialogButtons>
            </SaveDialogContent>
        </SaveDialog>
    );
};

export default ExportLevelDialog;
