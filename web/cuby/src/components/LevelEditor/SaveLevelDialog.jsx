import React from 'react';
import {
    SaveDialog,         // Reutilizamos el styled-component
    SaveDialogContent,  // Reutilizamos el styled-component
    Input,              // Reutilizamos el styled-component
    SaveDialogButtons,  // Reutilizamos el styled-component
} from './LevelEditor.styles';

const SaveLevelDialog = ({
    isOpen,
    onClose,
    onConfirm,
    levelName,
    onLevelNameChange, // Para el input dentro del diálogo
    isInverted,
}) => {
    if (!isOpen) return null;

    return (
        <SaveDialog onClick={onClose}> {/* Cerrar al hacer clic en el fondo */}
            <SaveDialogContent isInverted={isInverted} onClick={(e) => e.stopPropagation()}> {/* Evitar cierre al hacer clic dentro */}
                <h2>Guardar Nivel</h2>
                <p>Introduce un nombre para tu nivel:</p>
                <Input
                    type="text"
                    value={levelName}
                    onChange={onLevelNameChange} // Aquí usamos la prop
                    placeholder="Nombre del nivel"
                    isInverted={isInverted}
                    autoFocus
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter' && levelName.trim()) {
                            onConfirm();
                        }
                        if (e.key === 'Escape') {
                            onClose();
                        }
                    }}
                />
                <SaveDialogButtons isInverted={isInverted}>
                    <button onClick={onClose}>Cancelar</button>
                    <button onClick={onConfirm} disabled={!levelName.trim()}>
                        Guardar
                    </button>
                </SaveDialogButtons>
            </SaveDialogContent>
        </SaveDialog>
    );
};

export default SaveLevelDialog; 