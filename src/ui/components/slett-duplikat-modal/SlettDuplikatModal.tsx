import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import React from 'react';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './slettDuplikatModal.less';

interface SlettDuplikatModalProps {
    handleCloseModal: () => void;
    onDelete: () => void;
}

const SlettDuplikatModal = ({ handleCloseModal, onDelete }: SlettDuplikatModalProps): JSX.Element => (
    <Modal isOpen closeButton onRequestClose={handleCloseModal} contentLabel="Fjern som duplikat">
        <ModalFormWrapper title="Fjern som duplikat">
            <p>Når du fjerner et dokument som duplikat vil det bli lagt som et eget dokument i listen.</p>
            <div className={styles.buttonContainer}>
                <Hovedknapp
                    id="submitButton"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete();
                    }}
                >
                    Fjern som duplikat
                </Hovedknapp>
                <div className={styles.cancelButton}>
                    <Knapp htmlType="button" onClick={handleCloseModal}>
                        Avbryt
                    </Knapp>
                </div>
            </div>
        </ModalFormWrapper>
    </Modal>
);

export default SlettDuplikatModal;
