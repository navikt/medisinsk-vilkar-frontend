import React, { useMemo } from 'react';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.less';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import Box, { Margin } from '../box/Box';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import Diagnosekode from '../../../types/Diagnosekode';

interface DiagnosekodeModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onSaveClick: (nyDiagnosekode: Diagnosekode) => void;
}

const DiagnosekodeModal = ({ isOpen, onRequestClose, onSaveClick }: DiagnosekodeModalProps) => {
    const [selectedDiagnosekode, setSelectedDiagnosekode] = React.useState<Diagnosekode>(null);
    return (
        <Modal
            isOpen={isOpen}
            closeButton
            onRequestClose={onRequestClose}
            contentLabel="Legg til diagnosekode"
            className={styles.diagnosekodeoversikt__modal}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSaveClick(selectedDiagnosekode);
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
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <div style={{ display: 'flex' }}>
                            <Hovedknapp mini>Bekreft</Hovedknapp>
                            <Knapp mini style={{ marginLeft: '1rem' }} htmlType="button" onClick={onRequestClose}>
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
