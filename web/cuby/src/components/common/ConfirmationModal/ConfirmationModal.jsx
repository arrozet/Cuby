// src/components/common/ConfirmationModal/ConfirmationModal.jsx
import React from 'react';
import { 
  ModalOverlay, 
  ModalContainer, 
  ModalMessage, 
  ModalButtonContainer, 
  ConfirmButton, 
  CancelButton 
} from './ConfirmationModal.styles';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, isInverted }) => {
  if (!isOpen) {
    return null;
  }

  // Evita que los clics dentro del modal se propaguen al overlay y lo cierren
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <ModalOverlay onClick={onClose} $isInverted={isInverted}>
      <ModalContainer onClick={handleModalContentClick} $isInverted={isInverted}>
        <ModalMessage $isInverted={isInverted}>{message}</ModalMessage>
        <ModalButtonContainer>
          <CancelButton onClick={onClose} $isInverted={isInverted}>
            Cancelar
          </CancelButton>
          <ConfirmButton onClick={onConfirm} $isInverted={isInverted}>
            Confirmar
          </ConfirmButton>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmationModal;