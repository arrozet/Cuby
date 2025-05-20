import React, { useState } from 'react';
import {
    SaveDialog,
    SaveDialogContent,
    Input,
    SaveDialogButtons,
} from './LevelEditor.styles';

const ImportLevelDialog = ({
    isOpen,
    onClose,
    onConfirm,
    isInverted,
}) => {
    const [codeInput, setCodeInput] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (codeInput.trim()) {
            onConfirm(codeInput);
            setCodeInput(''); // Limpiar el input después de importar
        }
    };

    return (
        <SaveDialog onClick={onClose}> {/* Cerrar al hacer clic en el fondo */}
            <SaveDialogContent isInverted={isInverted} onClick={(e) => e.stopPropagation()}> {/* Evitar cierre al hacer clic dentro */}
                <h2>Importar nivel</h2>
                <p>Pega el código del nivel:</p>
                <Input
                    type="text"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Código del nivel"
                    isInverted={isInverted}
                    autoFocus
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && codeInput.trim()) {
                            handleConfirm();
                        }
                        if (e.key === 'Escape') {
                            onClose();
                        }
                    }}
                />
                <SaveDialogButtons isInverted={isInverted}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={handleConfirm} disabled={!codeInput.trim()}>
                        Importar
                    </button>
                </SaveDialogButtons>
            </SaveDialogContent>
        </SaveDialog>
    );
};

export default ImportLevelDialog;