import React from 'react';
import styled from 'styled-components';
import BaseDialog from './BaseDialog';

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

const ExportLevelDialog = ({ isOpen, onClose, exportCode, isInverted }) => {
    const buttons = <button onClick={onClose}>Cerrar</button>;

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
            isInverted={isInverted}
            title="Exportar nivel"
            buttons={buttons}
        >
            <p>Código del nivel copiado al portapapeles:</p>
            <CodeContainer $isInverted={isInverted}>
                {exportCode}
            </CodeContainer>
        </BaseDialog>
    );
};

export default ExportLevelDialog;