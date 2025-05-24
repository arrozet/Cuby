import React from 'react';
import BaseDialog from './BaseDialog';
import { Input } from './dialogs.styles';

const SaveLevelDialog = ({
    isOpen,
    onClose,
    onConfirm,
    levelName,
    onLevelNameChange,
    isInverted,
}) => {
    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.key === 'Enter' && levelName.trim()) {
            onConfirm();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    const buttons = (
        <>
            <button onClick={onClose}>Cancelar</button>
            <button onClick={onConfirm} disabled={!levelName.trim()}>
                Guardar
            </button>
        </>
    );

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
            isInverted={isInverted}
            title="Guardar nivel"
            buttons={buttons}
            onBackdropClick={onClose} // Permitir cerrar clickeando el fondo
        >
            <p>Introduce un nombre para tu nivel:</p>
            <Input
                type="text"
                value={levelName}
                onChange={onLevelNameChange}
                placeholder="Nombre del nivel"
                $isInverted={isInverted}
                autoFocus
                onKeyDown={handleKeyDown}
            />
        </BaseDialog>
    );
};

export default SaveLevelDialog;