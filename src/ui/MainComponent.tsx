import { TabsPure } from 'nav-frontend-tabs';
import { Systemtittel } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import Box, { Margin } from './components/box/Box';
import Legeerklæring from './components/form-legeerklæring/Legeerklæring';
import Step from './components/step/Step';
import Vilkårsvurdering from './components/form-vilkårsvurdering/Vilkårsvurdering';
import styles from './main.less';
import SykdomFormValues from '../types/SykdomFormState';
import PeriodList from './components/period-list/PeriodList';

const tabs = ['Legeerklæring', 'Vilkårsvurdering'];

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValues.INNLEGGELSESPERIODER]: [
                { fom: '2020-09-11', tom: '2020-09-18' },
                { fom: '2020-10-01', tom: '2020-10-05' },
            ],
            [SykdomFormValues.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [SykdomFormValues.VURDERING_TO_OMSORGSPERSONER]: '',
            [SykdomFormValues.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: [
                { fom: '', tom: '' },
            ],
            [SykdomFormValues.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER]: [{ fom: '', tom: '' }],
        },
        shouldUnregister: false,
    });

    return (
        <div className={styles.main}>
            <Systemtittel>Sykdom</Systemtittel>
            <Box marginTop={Margin.large}>
                <PeriodList periods={[sykdom.periodeTilVurdering] || []} title="Søknadsperiode:" />
            </Box>
            <Box marginTop={Margin.large}>
                <TabsPure
                    tabs={tabs.map((tab, index) => ({
                        aktiv: activeTab === index,
                        label: tab,
                    }))}
                    onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
                />
                <FormProvider {...formMethods}>
                    {activeTab === 0 && (
                        <Step
                            onSubmit={formMethods.handleSubmit((data) => {
                                setActiveTab(1);
                                console.log(data);
                            })}
                            buttonLabel="Fortsett til vilkårsvurdering"
                        >
                            <Legeerklæring sykdom={sykdom} />
                        </Step>
                    )}
                    {activeTab === 1 && (
                        <Step
                            onSubmit={formMethods.handleSubmit((data) => console.log(data))}
                            buttonLabel="Bekreft vurdering"
                        >
                            <Vilkårsvurdering sykdom={sykdom} />
                        </Step>
                    )}
                </FormProvider>
            </Box>
        </div>
    );
};

export default MainComponent;
