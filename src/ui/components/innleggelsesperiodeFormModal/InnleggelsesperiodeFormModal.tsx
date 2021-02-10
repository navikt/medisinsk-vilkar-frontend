import React, { useEffect } from 'react';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import { FormProvider, useForm } from 'react-hook-form';
import { Element } from 'nav-frontend-typografi';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import DeleteButton from '../delete-button/DeleteButton';
import Form from '../form/Form';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import { FieldName } from '../innleggelsesperiodeoversikt/Innleggelsesperiodeoversikt';
import styles from './innleggelsesperiodeFormModal.less';
import { Period } from '../../../types/Period';

interface InnleggelsesperiodeFormModal {
    defaultValues: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
    setModalIsOpen: (isOpen: boolean) => void;
    lagreInnleggelsesperioder: (formState) => void;
    isLoading: boolean;
}

const InnleggelsesperiodeFormModal = ({
    defaultValues,
    setModalIsOpen,
    lagreInnleggelsesperioder,
    isLoading,
}: InnleggelsesperiodeFormModal): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        mode: 'onChange',
    });

    const {
        formState: { isDirty },
        watch,
    } = formMethods;

    const [showDeletedWarning, setShowDeletedWarning] = React.useState(false);
    const innleggelsesperioder = watch(FieldName.INNLEGGELSESPERIODER);

    const handleSubmit = (formState) => {
        lagreInnleggelsesperioder(formState);
    };

    useEffect(() => {
        return () => setShowDeletedWarning(false);
    }, []);

    const handleCloseModal = () => {
        if ((isDirty && window.confirm('Du vil miste alle endringer du har gjort')) || !isDirty) {
            setModalIsOpen(false);
            setShowDeletedWarning(false);
        }
    };

    return (
        <Modal
            isOpen
            closeButton
            onRequestClose={handleCloseModal}
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
                                validators={{
                                    overlaps: (periodValue: Period) => {
                                        const innleggelsesperioderFormValue = innleggelsesperioder
                                            .filter(({ period }: any) => period !== periodValue)
                                            .map(({ period }: any) => new Period(period.fom, period.tom));

                                        const period = new Period(periodValue.fom, periodValue.tom);
                                        if (period.overlapsWithSomePeriodInList(innleggelsesperioderFormValue)) {
                                            return 'Innleggelsesperiodene kan ikke overlappe';
                                        }
                                        return null;
                                    },
                                    fomIsBeforeOrSameAsTom: (periodValue: Period) => {
                                        const period = new Period(periodValue.fom, periodValue.tom);
                                        if (period.fomIsBeforeOrSameAsTom() === false) {
                                            return 'Fra-dato må være tidligere eller samme som til-dato';
                                        }
                                        return null;
                                    },
                                }}
                                renderBeforeFieldArray={(fieldArrayMethods) => (
                                    <>
                                        <Box marginTop={Margin.large} marginBottom={Margin.medium}>
                                            <AddButton
                                                label="Legg til innleggelsesperiode"
                                                onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                                            />
                                        </Box>
                                        <Box marginTop={Margin.medium}>
                                            <div className={styles.innleggelsesperiodeFormModal__pickerLabels}>
                                                <Element
                                                    className={styles.innleggelsesperiodeFormModal__firstLabel}
                                                    aria-hidden
                                                >
                                                    Fra
                                                </Element>
                                                <Element aria-hidden>Til</Element>
                                            </div>
                                        </Box>
                                    </>
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
                                <Hovedknapp spinner={isLoading} autoDisableVedSpinner mini>
                                    Lagre
                                </Hovedknapp>
                                <Knapp
                                    mini
                                    style={{ marginLeft: '1rem' }}
                                    htmlType="button"
                                    onClick={handleCloseModal}
                                    disabled={isLoading}
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
