import { TabsPure } from 'nav-frontend-tabs';
import { Systemtittel } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import Box, { Margins } from './components/Box';
import Legeerklæring from './components/Legeerklæring';
import styles from './components/medisinskVilkar.less';

const tabs = ['Legeerklæring', 'Vilkårsvurdering'];

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div style={{ margin: '2rem' }}>
            <Box marginBottom={Margins.small}>
                <Systemtittel>Fakta</Systemtittel>
            </Box>
            <Box marginTop={Margins.large}>
                <TabsPure
                    tabs={tabs.map((tab, index) => ({
                        aktiv: activeTab === index,
                        label: tab,
                    }))}
                    onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
                />
                <Box marginTop={Margins.large}>
                    <div className={activeTab === 0 ? '' : styles.hide}>
                        <Legeerklæring thisTab={0} changeTab={setActiveTab} sykdom={sykdom} />
                    </div>
                </Box>
            </Box>
        </div>
    );
};

export default MainComponent;
