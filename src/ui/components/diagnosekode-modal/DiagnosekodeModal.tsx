import { Modal } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React from 'react';
import Diagnosekode from '../../../types/Diagnosekode';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.css';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';

interface DiagnosekodeModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSaveClick: (nyDiagnosekode: Diagnosekode) => Promise<unknown>;
}

const DiagnosekodeModal = ({ isOpen, onRequestClose, onSaveClick }: DiagnosekodeModalProps): JSX.Element => {
    const [selectedDiagnosekode, setSelectedDiagnosekode] = React.useState<Diagnosekode>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    return (
        <Modal open={isOpen} closeButton onClose={onRequestClose} className={styles.diagnosekodeoversikt__modal}>
            <Modal.Content>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSubmitting(true);
                        onSaveClick(selectedDiagnosekode).then(
                            () => setTimeout(() => setIsSubmitting(false), 2500),
                            () => setTimeout(() => setIsSubmitting(false), 2500)
                        );
                    }}
                >
                    <ModalFormWrapper title="Legg til diagnosekode">
                        <Box marginTop={Margin.large}>
                            <DiagnosekodeSelector
                                initialDiagnosekodeValue=""
                                name="diagnosekode"
                                onChange={({ key, value }) => {
                                    setSelectedDiagnosekode({ kode: key, beskrivelse: value });
                                }}
                                label="Diagnosekode"
                                hideLabel
                                showSpinner
                            />
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <div style={{ display: 'flex' }}>
                                <Hovedknapp
                                    mini
                                    disabled={isSubmitting}
                                    spinner={isSubmitting}
                                    id="bekreftDiagnosekodeKnapp"
                                >
                                    Bekreft
                                </Hovedknapp>
                                <Knapp
                                    mini
                                    style={{ marginLeft: '1rem' }}
                                    htmlType="button"
                                    onClick={onRequestClose}
                                    disabled={isSubmitting}
                                >
                                    Avbryt
                                </Knapp>
                            </div>
                        </Box>
                    </ModalFormWrapper>
                </form>
            </Modal.Content>
        </Modal>
    );
};

export default DiagnosekodeModal;
