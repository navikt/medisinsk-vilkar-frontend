import React, { useMemo } from 'react';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import axios from 'axios';
import styles from '../diagnosekodeoversikt/diagnosekodeoversikt.less';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import Box, { Margin } from '../box/Box';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import Diagnosekode from '../../../types/Diagnosekode';
import { submitData } from '../../../util/httpUtils';
import Link from '../../../types/Link';

interface DiagnosekodeModalProps {
    isOpen: boolean;
    onDiagnosekodeSaved: () => void;
    onRequestClose: () => void;
    lagreDiagnosekodeLink: Link;
}

const DiagnosekodeModal = ({
    isOpen,
    onRequestClose,
    onDiagnosekodeSaved,
    lagreDiagnosekodeLink,
}: DiagnosekodeModalProps) => {
    const [selectedDiagnosekode, setSelectedDiagnosekode] = React.useState<Diagnosekode>(null);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    React.useEffect(() => {
        return () => httpCanceler.cancel();
    }, []);

    const saveDiagnosekode = (diagnosekode: Diagnosekode) => {
        return submitData(
            lagreDiagnosekodeLink.href,
            { ...lagreDiagnosekodeLink.requestPayload, diagnosekode },
            {
                cancelToken: httpCanceler.token,
            }
        );
    };

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
                    saveDiagnosekode(selectedDiagnosekode).then(onDiagnosekodeSaved);
                }}
            >
                <ModalFormWrapper title="Legg til diagnosekode">
                    <Box marginTop={Margin.large}>
                        <DiagnosekodeSelector
                            initialDiagnosekodeValue=""
                            name="diagnosekode"
                            onChange={({ key, value }) => {
                                setSelectedDiagnosekode({ kode: key, beskrivelse: value, links: [] });
                            }}
                            label="Diagnosekode"
                            hideLabel
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <div style={{ display: 'flex' }}>
                            <Hovedknapp mini>Lagre</Hovedknapp>
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
