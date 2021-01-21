import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import DeleteButton from '../delete-button/DeleteButton';
import Form from '../form/Form';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import styles from './innleggelsesperiodeFormModal.less';

const InnleggelsesperiodeFormModal = ({ defaultValues, setModalIsOpen, lagreInnleggelsesperioder }) => {
    const formMethods = useForm({
        defaultValues,
    });

    const [showDeletedWarning, setShowDeletedWarning] = React.useState(false);

    const handleSubmit = (formState) => {
        lagreInnleggelsesperioder(formState);
        setShowDeletedWarning(false);
    };

    return (
        <Modal
            isOpen
            closeButton
            onRequestClose={() => {
                setModalIsOpen(false);
                setShowDeletedWarning(false);
            }}
            contentLabel="Legg til innleggelsesperiode"
            className={styles.innleggelsesperiodeFormModal}
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
                                defaultValues={defaultValues[FieldName.INNLEGGELSESPERIODER] || []}
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
                                        <DeleteButton
                                            onClick={() => {
                                                fieldArrayMethods.remove(index);
                                                setShowDeletedWarning(true);
                                            }}
                                        />
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
                                    onClick={() => {
                                        setModalIsOpen(false);
                                        setShowDeletedWarning(false);
                                    }}
                                >
                                    Avbryt
                                </Knapp>
                            </div>
                        </Box>
                    </ModalFormWrapper>
                </Form>
            </FormProvider>
        </Modal>
    );
};
export default InnleggelsesperiodeFormModal;