import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

interface ConfirmationModalProps {
    children: React.ReactNode;
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const ConfirmationModal = ({ children, onConfirm, onCancel, isOpen }: ConfirmationModalProps) => {
    return (
        <Modal isOpen={isOpen} onRequestClose={onCancel} contentLabel="">
            {children}
            <Knapp onClick={onConfirm}>Bekreft</Knapp>
            <Knapp onClick={onCancel}>Avbryt</Knapp>
        </Modal>
    );
};

export default ConfirmationModal;
