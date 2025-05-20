import React from 'react';
import {
    SaveDialog,
    SaveDialogContent,
    SaveDialogButtons,
} from './LevelEditor.styles';

const ImportSuccessDialog = ({ isOpen, onClose, isInverted }) => {
    if (!isOpen) return null;

    return (
        <SaveDialog onClick={onClose}> {/* Cerrar al hacer clic en el fondo */}
            <SaveDialogContent isInverted={isInverted} onClick={(e) => e.stopPropagation()}> {/* Evitar cierre al hacer clic dentro */}
                <h2>Importación exitosa</h2>
                <p>Nivel importado con éxito. Recuerda guardarlo.</p>
                <SaveDialogButtons isInverted={isInverted}>
                    <button onClick={onClose}>Aceptar</button>
                </SaveDialogButtons>
            </SaveDialogContent>
        </SaveDialog>
    );
};

export default ImportSuccessDialog;
