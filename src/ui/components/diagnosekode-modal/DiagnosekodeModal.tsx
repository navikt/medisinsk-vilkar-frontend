import { Button, Modal } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import Diagnosekode from '../../../types/Diagnosekode';
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
        <Modal open={isOpen} closeButton onClose={onRequestClose} className={styles.diagnosekodeoversikt__modal}>
            <Modal.Content>
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
                                <Button
                                    size="small"
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                    id="bekreftDiagnosekodeKnapp"
                                >
                                    Bekreft
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="small"
                                    style={{ marginLeft: '1rem' }}
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                >
                                    Avbryt
                                </Button>
                            </div>
                        </Box>
                    </ModalFormWrapper>
                </form>
            </Modal.Content>
        </Modal>
    );
};

export default DiagnosekodeModal;
