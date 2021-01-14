import React from 'react';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Input } from 'nav-frontend-skjema';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import Box, { Margin } from '../box/Box';
import AddButton from '../add-button/AddButton';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';

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
                {diagnosekoder.length >= 1 && (
                    <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                        {diagnosekoder.map((diagnosekode) => (
                            <li key={diagnosekode}>{diagnosekode}</li>
                        ))}
                    </ul>
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
                            <Input onChange={(event) => setNyDiagnosekode(event.target.value)} label="Diagnosekode" />
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <div style={{ display: 'flex' }}>
                                <Hovedknapp mini>Lagre</Hovedknapp>
                                <Knapp
                                    mini
                                    style={{ marginLeft: '1rem' }}
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
