import { TabsPure } from 'nav-frontend-tabs';
import { Systemtittel } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import Box, { Margin } from './components/Box';
import Legeerklæring from './components/Legeerklæring';
import styles from './components/medisinskVilkar.less';
import Step from './components/Step';
import Vilkårsvurdering from './components/Vilkårsvurdering';

const tabs = ['Legeerklæring', 'Vilkårsvurdering'];

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);
    const formMethods = useForm({
        defaultValues: {
            innleggelseperioder: [{ fra: '', til: '' }],
        },
        shouldUnregister: false,
    });

    return (
        <div className={styles.main}>
            <Systemtittel>Fakta</Systemtittel>
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
                            buttonLabel="Gå videre"
                        >
                            <Legeerklæring sykdom={sykdom} />
                        </Step>
                    )}
                    {activeTab === 1 && (
                        <Step
                            onSubmit={formMethods.handleSubmit((data) => console.log(data))}
                            buttonLabel="Send inn"
                        >
                            <Vilkårsvurdering />
                        </Step>
                    )}
                </FormProvider>
            </Box>
        </div>
    );
};

export default MainComponent;
