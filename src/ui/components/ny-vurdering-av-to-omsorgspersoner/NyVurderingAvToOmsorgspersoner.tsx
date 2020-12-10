import React from 'react';
import { getPeriodAsListOfDays } from '../../../util/dateUtils';
import { harBruktDokumentasjon, required, fomDatoErFørTomDato } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import TextArea from '../../form/wrappers/TextArea';
import Box, { Margin } from '../box/Box';
import { Period } from '../../../types/Period';
import { FormProvider, useForm } from 'react-hook-form';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { finnHullIPerioder, finnMaksavgrensningerForPerioder } from '../../../util/periodUtils';
import { convertToInternationalPeriod } from '../../../util/formats';
import styles from './nyVurderingAvToOmsorgspersonerForm.less';
import CheckboxGroup from '../../form/wrappers/CheckboxGroup';
import Dokument from '../../../types/Dokument';
import DokumentLink from '../dokument-link/DokumentLink';

export enum FieldName {
    VURDERING_AV_TO_OMSORGSPERSONER = 'vurderingAvToOmsorgspersoner',
    HAR_BEHOV_FOR_TO_OMSORGSPERSONER = 'harBehovForToOmsorgspersoner',
    PERIODER = 'perioder',
    DOKUMENTER = 'dokumenter',
}

export interface VurderingAvToOmsorgspersonerFormState {
    [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]?: string;
    [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]?: boolean;
    [FieldName.PERIODER]?: Period[];
    [FieldName.DOKUMENTER]: string[];
}

interface VurderingAvToOmsorgspersonerFormProps {
    defaultValues: VurderingAvToOmsorgspersonerFormState;
    onSubmit: (data: VurderingAvToOmsorgspersonerFormState) => void;
    perioderSomSkalVurderes?: Period[];
    sammenhengendePerioderMedTilsynsbehov: Period[];
    dokumenter: Dokument[];
}

export default ({
    defaultValues,
    onSubmit,
    perioderSomSkalVurderes,
    sammenhengendePerioderMedTilsynsbehov,
    dokumenter,
}: VurderingAvToOmsorgspersonerFormProps): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        shouldUnregister: false,
    });

    const perioderSomBlirVurdert = formMethods.watch(FieldName.PERIODER);

    const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
        const dagerSomSkalVurderes = (perioderSomSkalVurderes || []).flatMap(getPeriodAsListOfDays);
        const dagerSomBlirVurdert = (perioderSomBlirVurdert || [])
            .map((period) => {
                if ((period as any).period) {
                    return (period as any).period;
                }
                return period;
            })
            .flatMap(getPeriodAsListOfDays);
        return dagerSomSkalVurderes.every((dagSomSkalVurderes) => dagerSomBlirVurdert.indexOf(dagSomSkalVurderes) > -1);
    }, [perioderSomSkalVurderes, perioderSomBlirVurdert]);

    const hullISøknadsperiodene = React.useMemo(
        () =>
            finnHullIPerioder(sammenhengendePerioderMedTilsynsbehov).map((periode) =>
                convertToInternationalPeriod(periode)
            ),
        [sammenhengendePerioderMedTilsynsbehov]
    );

    const avgrensningerForSøknadsperiode = React.useMemo(
        () => finnMaksavgrensningerForPerioder(sammenhengendePerioderMedTilsynsbehov),
        [sammenhengendePerioderMedTilsynsbehov]
    );
    return (
        <DetailView title="Vurdering av to omsorgspersoner">
            <FormProvider {...formMethods}>
                <Form buttonLabel="Lagre og vurder resterende periode" onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <Box marginTop={Margin.large}>
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
                    <Box marginTop={Margin.large}>
                        <TextArea
                            textareaClass={styles.begrunnelsesfelt}
                            name={FieldName.VURDERING_AV_TO_OMSORGSPERSONER}
                            helptext="Dersom det er behov for to omsorgsperoner deler av perioden,  må det komme tydelig frem av vurderingen hvilke perioder det er behov og hvilke det ikke er behov."
                            label={
                                <>
                                    <b>Gjør en vurdering av om det er behov for to omsorgspersoner.</b>
                                    <span style={{ fontWeight: 400 }}>
                                        &nbsp;Dersom det er behov for to omsorgsperoner deler av perioden, må det komme
                                        tydelig frem av vurderingen hvilke perioder det er behov og hvilke det ikke er
                                        behov.
                                    </span>
                                </>
                            }
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <YesOrNoQuestion
                            question="Er det behov for to omsorgspersoner?"
                            name={FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER}
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
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
                        />
                    </Box>
                    {!harVurdertAlleDagerSomSkalVurderes && (
                        <Box marginTop={Margin.large}>
                            <AlertStripeAdvarsel>
                                Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du
                                etter at du har lagret denne.
                            </AlertStripeAdvarsel>
                        </Box>
                    )}
                </Form>
            </FormProvider>
        </DetailView>
    );
};
