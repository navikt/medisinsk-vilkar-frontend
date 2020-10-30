import { TabsPure } from 'nav-frontend-tabs';
import { Systemtittel } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import Box, { Margin } from './components/box/Box';
import { SykdomFormValue } from '../types/SykdomFormState';
import PeriodList from './components/period-list/PeriodList';
import Vilkårsvurdering from './components/vilkårsvurdering/Vilkårsvurdering';
import LegeerklæringForm from './components/form-legeerklæring/LegeerklæringForm';
import styles from './main.less';

const tabs = ['Legeerklæring', 'Medisinske vilkår'];

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);
    const formMethods = useForm({
        defaultValues: {
            [SykdomFormValue.INNLEGGELSESPERIODER]: [{ fom: '', tom: '' }],
            [SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [SykdomFormValue.VURDERING_TO_OMSORGSPERSONER]: '',
            [SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: [
                { fom: '', tom: '' },
            ],
            [SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER]: [{ fom: '', tom: '' }],
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
                        <LegeerklæringForm sykdom={sykdom} onSubmit={() => setActiveTab(1)} />
                    )}
                    {activeTab === 1 && <Vilkårsvurdering sykdom={sykdom} />}
                </FormProvider>
            </Box>
        </div>
    );
};

export default MainComponent;
