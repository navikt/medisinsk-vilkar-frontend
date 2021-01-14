import React from 'react';
import Modal from 'nav-frontend-modal';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import Box, { Margin } from '../box/Box';
import AddButton from '../add-button/AddButton';
import styles from './innleggelsesperiodeoversikt.less';
import PureDatepicker from '../../form/pure/PureDatepicker';
import { Period } from '../../../types/Period';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';

Modal.setAppElement('#app');
const Innleggelsesperiodeoversikt = () => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioder, setInnleggelsesperioder] = React.useState<Period[]>([]);
    const [nyInnleggelsesperiode, setNyInnleggelsesperiode] = React.useState<Period>(new Period('', ''));
    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <TitleWithUnderline>Innleggelsesperioder</TitleWithUnderline>
            <Box marginTop={Margin.large}>
                {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
                {innleggelsesperioder.length >= 1 && (
                    <Innleggelsesperiodeliste innleggelsesperioder={innleggelsesperioder} />
                )}
            </Box>
            <Box marginTop={Margin.large}>
                <AddButton label="Legg til innleggelsesperiode" onClick={() => setModalIsOpen(true)} />
            </Box>
            <Modal
                isOpen={modalIsOpen}
                closeButton
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
                contentLabel="Legg til innleggelsesperiode"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setInnleggelsesperioder([nyInnleggelsesperiode, ...innleggelsesperioder]);
                        setNyInnleggelsesperiode(new Period('', ''));
                        setModalIsOpen(false);
                    }}
                >
                    <ModalFormWrapper title="Legg til innleggelsesperiode">
                        <Box marginTop={Margin.large}>
                            <div style={{ display: 'flex' }}>
                                <div>
                                    <PureDatepicker
                                        label="Fra"
                                        ariaLabel="fra"
                                        value={nyInnleggelsesperiode.fom || ''}
                                        onChange={(fomValue) =>
                                            setNyInnleggelsesperiode(
                                                new Period(fomValue, nyInnleggelsesperiode.tom || '')
                                            )
                                        }
                                        inputId="nyInnleggelsesperiodeFom"
                                        calendarSettings={{ position: 'fullscreen' }}
                                    />
                                </div>
                                <div style={{ marginLeft: '1rem' }}>
                                    <PureDatepicker
                                        label="Til"
                                        ariaLabel="til"
                                        value={nyInnleggelsesperiode.tom || ''}
                                        onChange={(tomValue) =>
                                            setNyInnleggelsesperiode(
                                                new Period(nyInnleggelsesperiode.fom || '', tomValue)
                                            )
                                        }
                                        inputId="nyInnleggelsesperiodeTom"
                                        calendarSettings={{ position: 'fullscreen' }}
                                    />
                                </div>
                            </div>
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

export default Innleggelsesperiodeoversikt;
