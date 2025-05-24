import React from 'react';
import {
    SaveDialog,
    SaveDialogContent,
    SaveDialogButtons,
} from './dialogs.styles';

const BaseDialog = ({
    isOpen,
    onClose,
    isInverted,
    title,
    children,
    buttons,
    onBackdropClick,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            if (onBackdropClick) {
                onBackdropClick();
            } else {
                onClose();
            }
        }
    };

    return (
        <SaveDialog onClick={handleBackdropClick}>
            <SaveDialogContent $isInverted={isInverted} onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                {children}
                {buttons && (
                    <SaveDialogButtons $isInverted={isInverted}>
                        {buttons}
                    </SaveDialogButtons>
                )}
            </SaveDialogContent>
        </SaveDialog>
    );
};

export default BaseDialog;