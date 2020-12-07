import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { required } from '../../form/validators';
import TextArea from '../../form/wrappers/TextArea';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import Box, { Margin } from '../box/Box';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';
import { Period } from '../../../types/Period';
import { getPeriodAsListOfDays } from '../../../util/dateUtils';
import Documentation from '../../../types/Documentation';
import CheckboxGroup from '../../form/wrappers/CheckboxGroup';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import { convertToInternationalPeriod } from '../../../util/formats';
import { finnHullIPerioder, finnMaksavgrensningerForPerioder } from '../../../util/periodUtils';

export enum FieldName {
    VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE = 'vurderingAvKontinuerligTilsynOgPleie',
    HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE = 'harBehovForKontinuerligTilsynOgPleie',
    PERIODER = 'perioder',
    DOKUMENTER = 'dokumenter',
}

export interface VurderingAvTilsynsbehovFormState {
    [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]?: string;
    [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]?: boolean;
    [FieldName.PERIODER]?: Period[];
    [FieldName.DOKUMENTER]: Documentation[];
}

interface VurderingAvTilsynsbehovFormProps {
    defaultValues: VurderingAvTilsynsbehovFormState;
    onSubmit: (data: VurderingAvTilsynsbehovFormState) => void;
    perioderSomSkalVurderes?: Period[];
    sammenhengendeSøknadsperioder?: Period[];
}

export default ({
    defaultValues,
    onSubmit,
    perioderSomSkalVurderes,
    sammenhengendeSøknadsperioder,
}: VurderingAvTilsynsbehovFormProps): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        mode: 'onChange',
    });

    React.useEffect(() => {
        formMethods.reset(defaultValues);
    }, [defaultValues]);

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
        () => finnHullIPerioder(sammenhengendeSøknadsperioder).map((periode) => convertToInternationalPeriod(periode)),
        [sammenhengendeSøknadsperioder]
    );

    const avgrensningerForSøknadsperiode = React.useMemo(
        () => finnMaksavgrensningerForPerioder(sammenhengendeSøknadsperioder),
        [sammenhengendeSøknadsperioder]
    );

    return (
        <DetailView title="Vurdering av tilsyn og pleie">
            <FormProvider {...formMethods} handleSubmit={formMethods.handleSubmit}>
                <Form buttonLabel="Lagre" onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <Box marginTop={Margin.large}>
                        <CheckboxGroup
                            question="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
                            name="stuff"
                            checkboxes={[
                                { value: 'foo', label: 'Foo' },
                                { value: 'bar', label: 'Bar' },
                            ]}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <TextArea
                            name={FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE}
                            label={
                                <>
                                    <b>
                                        Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen.
                                    </b>
                                    <span style={{ fontWeight: 400 }}>
                                        &nbsp;Dersom det er behov for tilsyn og pleie kun i deler av perioden må det
                                        komme tydelig frem av vurderingen hvilke perioder det er behov og hvilke det
                                        ikke er behov.
                                    </span>
                                </>
                            }
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <YesOrNoQuestion
                            question="Er det behov for tilsyn og pleie?"
                            name={FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
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
                                inngårISammenhengendeSøknadsperiode: (value: Period) => {
                                    const isOk = sammenhengendeSøknadsperioder.some((sammenhengendeSøknadsperiode) =>
                                        sammenhengendeSøknadsperiode.covers(value)
                                    );

                                    if (!isOk) {
                                        return 'Perioden som vurderes må være innenfor en eller flere sammenhengede søknadsperioder';
                                    }
                                },
                            }}
                            fromDatepickerProps={{
                                label: 'Fra',
                                ariaLabel: 'fra',
                                limitations: {
                                    minDate: avgrensningerForSøknadsperiode?.fom,
                                    maxDate: avgrensningerForSøknadsperiode?.tom,
                                    invalidDateRanges: hullISøknadsperiodene,
                                },
                            }}
                            toDatepickerProps={{
                                label: 'Til',
                                ariaLabel: 'til',
                                limitations: {
                                    minDate: avgrensningerForSøknadsperiode?.fom,
                                    maxDate: avgrensningerForSøknadsperiode?.tom,
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
