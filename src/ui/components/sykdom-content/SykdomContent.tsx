import React, { useState } from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import { DevTool } from '@hookform/devtools';
import { FormProvider, useForm } from 'react-hook-form';
import { Systemtittel } from 'nav-frontend-typografi';
import Box, { Margin } from '../box/Box';
import Søknadsperiode from '../søknadsperiode/Søknadsperiode';
import LegeerklæringForm from '../form-legeerklæring/LegeerklæringForm';
import Vilkårsvurdering from '../vilkårsvurdering/Vilkårsvurdering';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import styles from './main.less';

const tabs = ['Legeerklæring', 'Medisinske vilkår'];
const SykdomContent = () => {
    const [activeTab, setActiveTab] = useState(0);
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValue.INNLEGGELSESPERIODER]: [{ fom: '', tom: '' }],
            [SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [SykdomFormValue.VURDERING_TO_OMSORGSPERSONER]: '',
            [SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: [{ fom: '', tom: '' }],
            [SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER]: [{ fom: '', tom: '' }],
        },
        shouldUnregister: false,
    });
    const { control } = formMethods;

    return (
        <div className={styles.main}>
            {process.env.NODE_ENV === 'development' && <DevTool control={control} />}
            <Systemtittel>Sykdom</Systemtittel>
            <Box marginTop={Margin.large}>
                <Søknadsperiode />
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
                        <LegeerklæringForm
                            onSubmit={() => {
                                setActiveTab(1);
                            }}
                        />
                    )}
                    {activeTab === 1 && <Vilkårsvurdering />}
                </FormProvider>
            </Box>
        </div>
    );
};

export default SykdomContent;
