import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Dokument from '../../../types/Dokument';
import { Period } from '../../../types/Period';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { getPeriodAsListOfDays } from '../../../util/dateUtils';
import { convertToInternationalPeriod, prettifyPeriod } from '../../../util/formats';
import {
    finnHullIPerioder,
    finnMaksavgrensningerForPerioder,
    slåSammenSammenhengendePerioder,
} from '../../../util/periodUtils';
import { lagToOmsorgspersonerVurdering } from '../../../util/vurderingUtils';
import { fomDatoErFørTomDato, harBruktDokumentasjon, required } from '../../form/validators';
import CheckboxGroup from '../../form/wrappers/CheckboxGroup';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import TextArea from '../../form/wrappers/TextArea';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import DeleteButton from '../delete-button/DeleteButton';
import DetailView from '../detail-view/DetailView';
import DokumentLink from '../dokument-link/DokumentLink';
import Form from '../form/Form';
import styles from './nyVurderingAvToOmsorgspersonerForm.less';

export enum FieldName {
    VURDERING_AV_TO_OMSORGSPERSONER = 'vurderingAvToOmsorgspersoner',
    HAR_BEHOV_FOR_TO_OMSORGSPERSONER = 'harBehovForToOmsorgspersoner',
    PERIODER = 'perioder',
    DOKUMENTER = 'dokumenter',
}

export interface NyVurderingAvToOmsorgspersonerFormState {
    [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]?: string;
    [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]?: boolean;
    [FieldName.PERIODER]?: Period[];
    [FieldName.DOKUMENTER]: string[];
}

interface NyVurderingAvToOmsorgspersonerFormProps {
    defaultValues: NyVurderingAvToOmsorgspersonerFormState;
    onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
    resterendeVurderingsperioder?: Period[];
    perioderSomKanVurderes?: Period[];
    dokumenter: Dokument[];
}

const NyVurderingAvToOmsorgspersonerForm = ({
    defaultValues,
    onSubmit,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    dokumenter,
}: NyVurderingAvToOmsorgspersonerFormProps): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        shouldUnregister: false,
    });

    const perioderSomBlirVurdert = formMethods.watch(FieldName.PERIODER);

    const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
        const dagerSomSkalVurderes = (resterendeVurderingsperioder || []).flatMap(getPeriodAsListOfDays);
        const dagerSomBlirVurdert = (perioderSomBlirVurdert || [])
            .map((period) => {
                if ((period as any).period) {
                    return (period as any).period;
                }
                return period;
            })
            .flatMap(getPeriodAsListOfDays);
        return dagerSomSkalVurderes.every((dagSomSkalVurderes) => dagerSomBlirVurdert.indexOf(dagSomSkalVurderes) > -1);
    }, [resterendeVurderingsperioder, perioderSomBlirVurdert]);

    const hullISøknadsperiodene = React.useMemo(
        () => finnHullIPerioder(perioderSomKanVurderes).map((periode) => convertToInternationalPeriod(periode)),
        [perioderSomKanVurderes]
    );

    const avgrensningerForSøknadsperiode = React.useMemo(
        () => finnMaksavgrensningerForPerioder(perioderSomKanVurderes),
        [perioderSomKanVurderes]
    );

    const lagNyVurdering = (formState: NyVurderingAvToOmsorgspersonerFormState) => {
        onSubmit(lagToOmsorgspersonerVurdering(formState, dokumenter));
    };

    const sammenhengendePerioderMedTilsynsbehov = React.useMemo(() => {
        return slåSammenSammenhengendePerioder(perioderSomKanVurderes);
    }, [perioderSomKanVurderes]);

    const førsteDefaultPeriode = defaultValues[FieldName.PERIODER][0];

    return (
        <DetailView
            title="Vurdering av to omsorgspersoner"
            renderNextToTitle={() => prettifyPeriod(førsteDefaultPeriode)}
        >
            <FormProvider {...formMethods}>
                <Form buttonLabel="Bekreft" onSubmit={formMethods.handleSubmit(lagNyVurdering)}>
                    {dokumenter?.length > 0 && (
                        <Box marginTop={Margin.xLarge}>
                            <CheckboxGroup
                                question="Hvilke dokumenter er brukt i vurderingen av to omsorgspersoner?"
                                name={FieldName.DOKUMENTER}
                                checkboxes={dokumenter.map((dokument) => ({
                                    value: dokument.id,
                                    label: <DokumentLink dokument={dokument} />,
                                }))}
                                validators={{
                                    harBruktDokumentasjon,
                                }}
                            />
                        </Box>
                    )}
                    <Box marginTop={Margin.xLarge}>
                        <TextArea
                            textareaClass={styles.begrunnelsesfelt}
                            name={FieldName.VURDERING_AV_TO_OMSORGSPERSONER}
                            label={
                                <b>
                                    Gjør en vurdering av om det er behov for to omsorgspersoner etter § 9-10, andre
                                    ledd.
                                </b>
                            }
                            validators={{ required }}
                            id="begrunnelsesfelt"
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <YesOrNoQuestion
                            question="Er det behov for to omsorgspersoner?"
                            name={FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER}
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <PeriodpickerList
                            legend="Oppgi perioder"
                            name={FieldName.PERIODER}
                            defaultValues={defaultValues[FieldName.PERIODER] || []}
                            validators={{
                                required,
                                inngårISammenhengendePeriodeMedTilsynsbehov: (value: Period) => {
                                    const isOk = sammenhengendePerioderMedTilsynsbehov.some(
                                        (sammenhengendeSøknadsperiode) => sammenhengendeSøknadsperiode.covers(value)
                                    );

                                    if (!isOk) {
                                        return 'Perioden som vurderes må være innenfor en eller flere sammenhengede perioder med behov for kontinuerlig tilsyn og pleie';
                                    }

                                    return true;
                                },
                                fomDatoErFørTomDato,
                            }}
                            fromDatepickerProps={{
                                label: 'Fra',
                                ariaLabel: 'fra',
                                limitations: {
                                    minDate: avgrensningerForSøknadsperiode?.fom || '',
                                    maxDate: avgrensningerForSøknadsperiode?.tom || '',
                                    invalidDateRanges: hullISøknadsperiodene,
                                },
                            }}
                            toDatepickerProps={{
                                label: 'Til',
                                ariaLabel: 'til',
                                limitations: {
                                    minDate: avgrensningerForSøknadsperiode?.fom || '',
                                    maxDate: avgrensningerForSøknadsperiode?.tom || '',
                                    invalidDateRanges: hullISøknadsperiodene,
                                },
                            }}
                            renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => {
                                return (
                                    <>
                                        {numberOfItems > 1 && (
                                            <DeleteButton
                                                onClick={() => {
                                                    fieldArrayMethods.remove(index);
                                                }}
                                            />
                                        )}
                                    </>
                                );
                            }}
                            renderAfterFieldArray={(fieldArrayMethods) => (
                                <Box marginTop={Margin.large}>
                                    <AddButton
                                        label="Legg til periode"
                                        onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                                        id="leggTilPeriodeKnapp"
                                    />
                                </Box>
                            )}
                        />
                    </Box>
                    {!harVurdertAlleDagerSomSkalVurderes && (
                        <Box marginTop={Margin.xLarge}>
                            <AlertStripeInfo>
                                Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du
                                etter at du har lagret denne.
                            </AlertStripeInfo>
                        </Box>
                    )}
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default NyVurderingAvToOmsorgspersonerForm;
