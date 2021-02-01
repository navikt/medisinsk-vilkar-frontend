import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

interface ConfirmationModalProps {
    children: React.ReactNode;
    promiseAttacher: (promise: Promise<void>) => void;
    isOpen: boolean;
}

const ConfirmationModal = ({ children, promiseAttacher, isOpen }: ConfirmationModalProps) => {
    const [resolver, setResolver] = React.useState(null);
    const [rejecter, setRejecter] = React.useState(null);

    React.useEffect(() => {
        promiseAttacher(
            new Promise((resolve, reject) => {
                setResolver(resolve);
                setRejecter(reject);
            })
        );
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onRequestClose={rejecter} contentLabel="">
            {children}
            <Knapp onClick={resolver}>Bekreft</Knapp>
            <Knapp onClick={rejecter}>Avbryt</Knapp>
        </Modal>
    );
};

export default ConfirmationModal;
