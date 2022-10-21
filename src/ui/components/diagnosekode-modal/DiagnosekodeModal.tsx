import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import React from 'react';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.css';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';

interface DiagnosekodeModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSaveClick: (diagnosekoder: string[]) => Promise<unknown>;
}

const DiagnosekodeModal = ({ isOpen, onRequestClose, onSaveClick }: DiagnosekodeModalProps): JSX.Element => {
    const [selectedDiagnosekoder, setSelectedDiagnosekoder] = React.useState([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleClose = () => {
        setSelectedDiagnosekoder([]);
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            closeButton
            onRequestClose={handleClose}
            contentLabel="Legg til diagnosekoder"
            className={styles.diagnosekodeoversikt__modal}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsSubmitting(true);
                    onSaveClick(selectedDiagnosekoder).then(
                        () => setTimeout(() => setIsSubmitting(false), 2500),
                        () => setTimeout(() => setIsSubmitting(false), 2500)
                    );
                    setSelectedDiagnosekoder([]);
                }}
            >
                <ModalFormWrapper title="Legg til diagnosekoder">
                    <Box marginTop={Margin.large}>
                        <DiagnosekodeSelector
                            initialDiagnosekodeValue=""
                            name="diagnosekode"
                            onChange={(diagnosekoder) => {
                                setSelectedDiagnosekoder(diagnosekoder);
                            }}
                            label="Diagnosekode"
                            selectedDiagnosekoder={selectedDiagnosekoder}
                            hideLabel
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <div style={{ display: 'flex' }}>
                            <Hovedknapp mini disabled={isSubmitting} spinner={isSubmitting}>
                                Bekreft
                            </Hovedknapp>
                            <Knapp
                                mini
                                style={{ marginLeft: '1rem' }}
                                htmlType="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Avbryt
                            </Knapp>
                        </div>
                    </Box>
                </ModalFormWrapper>
            </form>
        </Modal>
    );
};

export default DiagnosekodeModal;
