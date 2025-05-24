import React from 'react';
import BaseDialog from './BaseDialog';

const ImportSuccessDialog = ({ isOpen, onClose, isInverted }) => {
    const buttons = <button onClick={onClose}>Aceptar</button>;

    return (
        <BaseDialog
            isOpen={isOpen}
            onClose={onClose}
            isInverted={isInverted}
            title="Importación exitosa"
            buttons={buttons}
            onBackdropClick={onClose} // Permitir cerrar clickeando el fondo
        >
            <p>Nivel importado con éxito. Recuerda guardarlo.</p>
        </BaseDialog>
    );
};

export default ImportSuccessDialog;