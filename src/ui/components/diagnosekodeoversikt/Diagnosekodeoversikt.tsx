import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import React from 'react';
import DiagnosekodeSelektor from '../../form/pure/PureDiagnosekodeSelector';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import styles from './diagnosekodeoversikt.less';

Modal.setAppElement('#app');
const Diagnosekodeoversikt = () => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [diagnosekoder, setDiagnosekoder] = React.useState<string[]>([]);
    const [nyDiagnosekode, setNyDiagnosekode] = React.useState<string>('');
    return (
        <div>
            <TitleWithUnderline>Diagnosekoder</TitleWithUnderline>
            <Box marginTop={Margin.large}>
                {diagnosekoder.length === 0 && <p>Ingen diagnosekoder registrert</p>}
                {diagnosekoder.length > 0 && (
                    <Diagnosekodeliste
                        diagnosekoder={diagnosekoder}
                        onDeleteClick={(diagnosekodeToDelete) => {
                            const updatedDiagnosekoder = [...diagnosekoder];
                            updatedDiagnosekoder.splice(diagnosekoder.indexOf(diagnosekodeToDelete), 1);
                            setDiagnosekoder(updatedDiagnosekoder);
                        }}
                    />
                )}
            </Box>
            <Box marginTop={Margin.large}>
                <AddButton label="Legg til diagnosekode" onClick={() => setModalIsOpen(true)} />
            </Box>
            <Modal
                isOpen={modalIsOpen}
                closeButton
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
                contentLabel="Legg til diagnosekode"
                className={styles.diagnosekodeoversikt__modal}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDiagnosekoder([nyDiagnosekode, ...diagnosekoder]);
                        setNyDiagnosekode('');
                        setModalIsOpen(false);
                    }}
                >
                    <ModalFormWrapper title="Legg til diagnosekode">
                        <Box marginTop={Margin.large}>
                            <DiagnosekodeSelektor
                                initialDiagnosekodeValue=""
                                name="diagnosekode"
                                onChange={(value) => setNyDiagnosekode(value)}
                                label="Diagnosekode"
                                hideLabel
                            />
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <div className={styles.diagnosekodeoversikt__buttonContainer}>
                                <Hovedknapp mini>Lagre</Hovedknapp>
                                <Knapp
                                    mini
                                    className={styles.diagnosekodeoversikt__abortButton}
                                    htmlType="button"
                                    onClick={() => setModalIsOpen(false)}
                                >
                                    Avbryt
                                </Knapp>
                            </div>
                        </Box>
                    </ModalFormWrapper>
                </form>
            </Modal>
        </div>
    );
};

export default Diagnosekodeoversikt;
