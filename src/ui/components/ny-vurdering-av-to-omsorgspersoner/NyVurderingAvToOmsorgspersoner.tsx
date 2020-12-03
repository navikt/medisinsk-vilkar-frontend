import React from 'react';
import { getPeriodAsListOfDays } from '../../../util/dateUtils';
import { required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import TextArea from '../../form/wrappers/TextArea';
import Box, { Margin } from '../box/Box';
import { Period } from '../../../types/Period';
import { FormProvider, useForm } from 'react-hook-form';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

export enum FieldName {
    VURDERING_AV_TO_OMSORGSPERSONER = 'vurderingAvToOmsorgspersoner',
    HAR_BEHOV_FOR_TO_OMSORGSPERSONER = 'harBehovForToOmsorgspersoner',
    PERIODER = 'perioder',
}

export interface VurderingAvToOmsorgspersonerFormState {
    [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]?: string;
    [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]?: boolean;
    [FieldName.PERIODER]?: Period[];
}

interface VurderingAvToOmsorgspersonerFormProps {
    defaultValues: VurderingAvToOmsorgspersonerFormState;
    onSubmit: (data: VurderingAvToOmsorgspersonerFormState) => void;
    perioderSomSkalVurderes?: Period[];
}

export default ({
    defaultValues,
    onSubmit,
    perioderSomSkalVurderes,
}: VurderingAvToOmsorgspersonerFormProps): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        shouldUnregister: false,
    });

    const perioderSomBlirVurdert = formMethods.watch(FieldName.PERIODER);

    const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
        const dagerSomSkalVurderes = (perioderSomSkalVurderes || []).flatMap(getPeriodAsListOfDays);
        const dagerSomBlirVurdert = (perioderSomBlirVurdert || []).flatMap(getPeriodAsListOfDays);
        return dagerSomSkalVurderes.every((dagSomSkalVurderes) => dagerSomBlirVurdert.indexOf(dagSomSkalVurderes) > -1);
    }, [perioderSomSkalVurderes, perioderSomBlirVurdert]);

    return (
        <DetailView title="Vurdering av to omsorgspersoner">
            <FormProvider {...formMethods}>
                <Form buttonLabel="Lagre og vurder resterende periode" onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <Box marginTop={Margin.large}>
                        <TextArea
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
                            periodpickerProps={{
                                fromDatepickerProps: {
                                    name: 'fom',
                                    ariaLabel: 'Fra',
                                },
                                toDatepickerProps: {
                                    name: 'tom',
                                    ariaLabel: 'Til',
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
