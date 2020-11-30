import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import DetailView from '../detail-view/DetailView';
import Form from '../form/Form';
import SykdomFormState, { SykdomFormValue } from '../../../types/SykdomFormState';
import Box, { Margin } from '../box/Box';
import TextArea from '../../form/wrappers/TextArea';
import { required } from '../../form/validators';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';

const NyVurderingAvToOmsorgspersoner = () => {
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValue.VURDERING_TO_OMSORGSPERSONER]: '',
            [SykdomFormValue.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
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
                <Form buttonLabel="Lagre og vurder resterende periode" onSubmit={handleSubmit(onSubmit)}>
                    <Box marginTop={Margin.large}>
                        <TextArea
                            name={SykdomFormValue.VURDERING_TO_OMSORGSPERSONER}
                            helptext="Dersom det er behov for to omsorgsperoner deler av perioden,  må det komme tydelig frem av vurderingen hvilke perioder det er behov og hvilke det ikke er behov."
                            label={<b>Gjør en vurdering av om det er behov for to omsorgspersoner</b>}
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <YesOrNoQuestion
                            question="Er det behov for to omsorgspersoner?"
                            name={SykdomFormValue.HAR_BEHOV_FOR_TO_OMSORGSPERSONER}
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.large}>
                        <PeriodpickerList
                            legend="Oppgi perioder"
                            name={SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER}
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
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default NyVurderingAvToOmsorgspersoner;
