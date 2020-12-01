import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import { getPeriodDifference } from '../../../util/dateUtils';
import SøknadsperiodeContext from '../../context/SøknadsperiodeContext';
import { required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import TextArea from '../../form/wrappers/TextArea';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import Box, { Margin } from '../box/Box';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';

export default () => {
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [SykdomFormValue.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN]: undefined,
            [SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: [],
        },
        shouldUnregister: false,
    });
    const { handleSubmit, watch } = formMethods;

    const søknadsperiode = React.useContext(SøknadsperiodeContext);
    const behovForKontinuerligTilsyn = watch(SykdomFormValue.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN) === true;
    const perioderMedBehovForTilsynOgPleie = watch(SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE);

    const erHeleSøknadsperiodenDekket = () => {
        return false;
        const resterendePeriode = getPeriodDifference(søknadsperiode, perioderMedBehovForTilsynOgPleie);
        return resterendePeriode.length === 0;
    };

    const onSubmit = () => null;

    return (
        <DetailView title="Vurdering av tilsyn og pleie">
            <FormProvider {...formMethods}>
                <Form buttonLabel="Lagre" onSubmit={handleSubmit(onSubmit)}>
                    <Box marginTop={Margin.large}>
                        <TextArea
                            name={SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE}
                            helptext="Dersom det er behov for tilsyn og pleie kun i deler av perioden må
                    det komme tydelig frem av vurderingen hvilke perioder det er behov og
                    hvilke det ikke er behov."
                            label={
                                <b>
                                    Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge av
                                    sykdommen.
                                </b>
                            }
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <YesOrNoQuestion
                            question="Er det behov for tilsyn og pleie"
                            name={SykdomFormValue.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN}
                            validators={{ required }}
                        />
                    </Box>
                    {behovForKontinuerligTilsyn && (
                        <>
                            <Box marginTop={Margin.large}>
                                <PeriodpickerList
                                    legend="Oppgi perioder"
                                    name={SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
                                    periodpickerProps={{
                                        fromDatepickerProps: {
                                            name: 'fom',
                                            label: 'Fra',
                                        },
                                        toDatepickerProps: {
                                            name: 'tom',
                                            label: 'Til',
                                        },
                                    }}
                                />
                            </Box>
                            {!erHeleSøknadsperiodenDekket() && (
                                <Box marginTop={Margin.large}>
                                    <AlertStripeAdvarsel>
                                        Du har ikke vurdert hele søknadsperioden. Resterende periode vurderer du etter
                                        at du har lagret denne.
                                    </AlertStripeAdvarsel>
                                </Box>
                            )}
                        </>
                    )}
                </Form>
            </FormProvider>
        </DetailView>
    );
};
