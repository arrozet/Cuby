import React, { useState } from 'react';
import BaseDialog from './BaseDialog';
import { Input } from './dialogs.styles';

const ImportLevelDialog = ({ isOpen, onClose, onConfirm, isInverted }) => {
    const [codeInput, setCodeInput] = useState('');

    const handleConfirm = () => {
        if (codeInput.trim()) {
            onConfirm(codeInput);
            setCodeInput('');
        }
    };

    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && codeInput.trim()) {
            handleConfirm();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const buttons = (
        <>
            <button onClick={onClose}>Cancelar</button>
            <button onClick={handleConfirm} disabled={!codeInput.trim()}>
                Importar
            </button>
        </>
    );

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
            isInverted={isInverted}
            title="Importar nivel"
            buttons={buttons}
        >
            <p>Pega el código del nivel:</p>
            <Input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Código del nivel"
                $isInverted={isInverted}
                autoFocus
                onKeyDown={handleKeyDown}
                aria-label="Introducir código del nivel"
            />
        </BaseDialog>
    );
};

export default ImportLevelDialog;