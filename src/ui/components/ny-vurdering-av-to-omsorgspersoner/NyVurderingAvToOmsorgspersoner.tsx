import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';
import SykdomFormState, { SykdomFormValue } from '../../../types/SykdomFormState';
import Box, { Margin } from '../box/Box';
import TextArea from '../../form/wrappers/TextArea';
import { required } from '../../form/validators';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';

const NyVurderingAvToOmsorgspersoner = () => {
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValue.VURDERING_TO_OMSORGSPERSONER]: '',
        },
        shouldUnregister: false,
    });
    const { handleSubmit } = formMethods;

    const onSubmit = (formValues: SykdomFormState) => {
        console.log(formValues);
    };

    return (
        <DetailView title="Vurdering av to omsorgspersoner">
            <FormProvider {...formMethods}>
                <Form buttonLabel="Lagre" onSubmit={handleSubmit(onSubmit)}>
                    <Box marginTop={Margin.large}>
                        <TextArea
                            name={SykdomFormValue.VURDERING_TO_OMSORGSPERSONER}
                            helptext="Dersom det er behov for to omsorgsperoner deler av perioden,  må det komme tydelig frem av vurderingen hvilke perioder det er behov og hvilke det ikke er behov."
                            label={
                                <b>
                                    Gjør en vurdering av om det er behov for to omsorgspersoner i perioden hvor det er
                                    behov for kontinerlig tilsyn og pleie
                                </b>
                            }
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <YesOrNoQuestion
                            question="Er det behov for to omsorgspersoner i perioden hvor vilkår for tilsyn og pleie er oppfylt?"
                            name={SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER}
                            validators={{ required }}
                        />
                    </Box>
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default NyVurderingAvToOmsorgspersoner;
