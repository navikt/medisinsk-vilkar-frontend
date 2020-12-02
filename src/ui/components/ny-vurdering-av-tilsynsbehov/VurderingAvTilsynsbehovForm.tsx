import React, { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import { doDryRun } from '../../../util/httpMock';
import { required } from '../../form/validators';
import TextArea from '../../form/wrappers/TextArea';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import Box, { Margin } from '../box/Box';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';
import Tilsynsperiodevelger from './Tilsynsperiodevelger';

export default () => {
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [SykdomFormValue.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN]: undefined,
            [SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: [],
        },
        shouldUnregister: false,
        mode: 'onChange',
    });
    const { handleSubmit, watch } = formMethods;

    const behovForKontinuerligTilsyn = watch(SykdomFormValue.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN) === true;

    const dryRun = useCallback(() => {
        doDryRun().then((result) => console.log(result));
    }, []);

    const onSubmit = (values) => console.log(values);
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
                            onChange={dryRun}
                        />
                    </Box>
                    {behovForKontinuerligTilsyn && (
                        <>
                            <Box marginTop={Margin.large}>
                                <Tilsynsperiodevelger dryRun={dryRun} />
                            </Box>
                        </>
                    )}
                </Form>
            </FormProvider>
        </DetailView>
    );
};
