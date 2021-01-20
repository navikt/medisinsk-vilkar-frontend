import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Period } from '../../../types/Period';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import DeleteButton from '../delete-button/DeleteButton';
import Form from '../form/Form';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import styles from './innleggelsesperiodeoversikt.less';

export enum FieldName {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}
export interface Innleggelsesperiodeoversikt {
    [FieldName.INNLEGGELSESPERIODER]?: Period[];
}

Modal.setAppElement('#app');
const Innleggelsesperiodeoversikt = () => {
    const formMethods = useForm({
        defaultValues: { [FieldName.INNLEGGELSESPERIODER]: [new Period('', '')] },
        shouldUnregister: false,
    });
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioder, setInnleggelsesperioder] = React.useState<Period[]>([]);
    const [showDeletedWarning, setShowDeletedWarning] = React.useState(false);

    const handleSubmit = (formState) => {
        const perioder = formState.innleggelsesperioder.map(
            (periodeWrapper) => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom)
        );
        setInnleggelsesperioder(perioder);
        setModalIsOpen(false);
    };

    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <div className={styles.innleggelsesperiodeoversikt__titleContainer}>
                <Undertittel>Innleggelsesperioder</Undertittel>
                {innleggelsesperioder.length > 0 && (
                    <button
                        type="button"
                        className={styles.innleggelsesperiodeoversikt__editButton}
                        onClick={() => setModalIsOpen(true)}
                    >
                        Rediger liste
                    </button>
                )}
            </div>
            <hr style={{ color: '#B7B1A9' }} />
            <Box marginTop={Margin.large}>
                {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
                {innleggelsesperioder.length > 0 && (
                    <>
                        <Element>Periode</Element>
                        <Box marginTop={Margin.small}>
                            <Innleggelsesperiodeliste innleggelsesperioder={innleggelsesperioder} />
                        </Box>
                    </>
                )}
            </Box>
            {innleggelsesperioder.length === 0 && (
                <Box marginTop={Margin.large}>
                    <AddButton label="Legg til innleggelsesperiode" onClick={() => setModalIsOpen(true)} />
                </Box>
            )}
            <Modal
                isOpen={modalIsOpen}
                closeButton
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
                contentLabel="Legg til innleggelsesperiode"
                className={styles.innleggelsesperiodeoversikt__modal}
            >
                <FormProvider {...formMethods}>
                    <Form onSubmit={formMethods.handleSubmit(handleSubmit)} shouldShowSubmitButton={false}>
                        <ModalFormWrapper title="Innleggelsesperioder">
                            <Box marginTop={Margin.large}>
                                <PeriodpickerList
                                    name="innleggelsesperioder"
                                    legend="Innleggelsesperioder"
                                    fromDatepickerProps={{
                                        ariaLabel: 'Fra',
                                        calendarSettings: { position: 'fullscreen' },
                                    }}
                                    toDatepickerProps={{
                                        ariaLabel: 'Til',
                                        calendarSettings: { position: 'fullscreen' },
                                    }}
                                    defaultValues={innleggelsesperioder}
                                    renderBeforeFieldArray={(fieldArrayMethods) => (
                                        <Box marginTop={Margin.large} marginBottom={Margin.medium}>
                                            <AddButton
                                                label="Legg til innleggelsesperiode"
                                                onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                                            />
                                        </Box>
                                    )}
                                    renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => {
                                        return (
                                            <>
                                                {numberOfItems > 1 && (
                                                    <DeleteButton
                                                        onClick={() => {
                                                            fieldArrayMethods.remove(index);
                                                            setShowDeletedWarning(true);
                                                        }}
                                                    />
                                                )}
                                            </>
                                        );
                                    }}
                                />
                                {showDeletedWarning && (
                                    <Box marginTop={Margin.large}>
                                        <AlertStripeAdvarsel>
                                            Ved å slette en innleggelsesperiode setter du i gang en revurdering.. Når du
                                            trykker lagre vil revurderingen starte automatisk. Påvirker alle søkere.
                                        </AlertStripeAdvarsel>
                                    </Box>
                                )}
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
                    </Form>
                </FormProvider>
            </Modal>
        </div>
    );
};

export default Innleggelsesperiodeoversikt;
