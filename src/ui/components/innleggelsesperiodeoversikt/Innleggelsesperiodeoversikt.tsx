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
    const [innleggelsesperiodeBeingEdited, setInnleggelsesperiodeBeingEdited] = React.useState<Period>(
        new Period('', '')
    );
    const [innleggelsesperiodeToBeReplaced, setInnleggelsesperiodeToBeReplaced] = React.useState<Period>(
        new Period('', '')
    );
    const [isReplacingPeriod, setIsReplacingPeriod] = React.useState(false);

    const replacePeriod = (innleggelsesperiodeToReplace, newInnleggelsesperiode) => {
        const updatedInnleggelsesperiodeliste = [...innleggelsesperioder];
        const indexOfPeriodeToReplace = updatedInnleggelsesperiodeliste.indexOf(innleggelsesperiodeToReplace);
        updatedInnleggelsesperiodeliste[indexOfPeriodeToReplace] = newInnleggelsesperiode;
        setInnleggelsesperioder(updatedInnleggelsesperiodeliste);
    };
    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <TitleWithUnderline>Innleggelsesperioder</TitleWithUnderline>
            <Box marginTop={Margin.large}>
                {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
                {innleggelsesperioder.length >= 1 && (
                    <Innleggelsesperiodeliste
                        innleggelsesperioder={innleggelsesperioder}
                        onEditClick={(innleggelsesperiodeToEdit) => {
                            setInnleggelsesperiodeToBeReplaced(innleggelsesperiodeToEdit);
                            setInnleggelsesperiodeBeingEdited(innleggelsesperiodeToEdit);
                            setModalIsOpen(true);
                            setIsReplacingPeriod(true);
                        }}
                        onDeleteClick={(innleggelsesperiodeToDelete) => {
                            const updatedInnleggelsesperiodeliste = [...innleggelsesperioder];
                            updatedInnleggelsesperiodeliste.splice(
                                innleggelsesperioder.indexOf(innleggelsesperiodeToDelete),
                                1
                            );
                            setInnleggelsesperioder(updatedInnleggelsesperiodeliste);
                        }}
                    />
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
                    setIsReplacingPeriod(false);
                }}
                contentLabel="Legg til innleggelsesperiode"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (isReplacingPeriod) {
                            replacePeriod(innleggelsesperiodeToBeReplaced, innleggelsesperiodeBeingEdited);
                            setInnleggelsesperiodeToBeReplaced(new Period('', ''));
                            setIsReplacingPeriod(false);
                        } else {
                            setInnleggelsesperioder([innleggelsesperiodeBeingEdited, ...innleggelsesperioder]);
                        }
                        setInnleggelsesperiodeBeingEdited(new Period('', ''));
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
                                        value={innleggelsesperiodeBeingEdited.fom || ''}
                                        onChange={(fomValue) =>
                                            setInnleggelsesperiodeBeingEdited(
                                                new Period(fomValue, innleggelsesperiodeBeingEdited.tom || '')
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
                                        value={innleggelsesperiodeBeingEdited.tom || ''}
                                        onChange={(tomValue) =>
                                            setInnleggelsesperiodeBeingEdited(
                                                new Period(innleggelsesperiodeBeingEdited.fom || '', tomValue)
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
                                    onClick={() => {
                                        setModalIsOpen(false);
                                        setIsReplacingPeriod(false);
                                    }}
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
