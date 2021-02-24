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
import { InnleggelsesperiodeDryRunResponse } from '../../../api/api';

interface InnleggelsesperiodeFormModal {
    defaultValues: {
        [FieldName.INNLEGGELSESPERIODER]: Period[];
    };
    setModalIsOpen: (isOpen: boolean) => void;
    onSubmit: (formState) => void;
    isLoading: boolean;
    endringerPåvirkerAndreBehandlinger: (innleggelsesperioder: Period[]) => Promise<InnleggelsesperiodeDryRunResponse>;
}

const InnleggelsesperiodeFormModal = ({
    defaultValues,
    setModalIsOpen,
    onSubmit,
    isLoading,
    endringerPåvirkerAndreBehandlinger,
}: InnleggelsesperiodeFormModal): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        mode: 'onChange',
    });

    const {
        formState: { isDirty },
        watch,
        getValues,
    } = formMethods;

    const [showWarningMessage, setShowWarningMessage] = React.useState(false);
    const innleggelsesperioder = watch(FieldName.INNLEGGELSESPERIODER);

    const handleSubmit = (formState) => {
        onSubmit(formState);
    };

    const handleCloseModal = () => {
        if ((isDirty && window.confirm('Du vil miste alle endringer du har gjort')) || !isDirty) {
            setModalIsOpen(false);
            setShowWarningMessage(false);
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
                                afterOnChange={() => {
                                    endringerPåvirkerAndreBehandlinger(
                                        innleggelsesperioder
                                    ).then(({ førerTilRevurdering }) => setShowWarningMessage(førerTilRevurdering));
                                }}
                                defaultValues={defaultValues[FieldName.INNLEGGELSESPERIODER] || []}
                                validators={{
                                    overlaps: (periodValue: Period) => {
                                        const innleggelsesperioderFormValue = getValues()
                                            .innleggelsesperioder.filter(
                                                (periodWrapper: any) => periodWrapper.period !== periodValue
                                            )
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
                                                id="leggTilInnleggelsesperiodeKnapp"
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
                                    return <DeleteButton onClick={() => fieldArrayMethods.remove(index)} />;
                                }}
                            />
                            {showWarningMessage && (
                                <Box marginTop={Margin.large}>
                                    <AlertStripeAdvarsel>
                                        Endringene du har gjort på innleggelsesperiodene vil føre til en ny revurdering
                                        av en annen behandling. Påvirker alle søkere.
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <div style={{ display: 'flex' }}>
                                <Hovedknapp spinner={isLoading} autoDisableVedSpinner mini>
                                    Bekreft
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
