import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import Box, { Margin } from '../box/Box';
import Parter from './Parter';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import styles from './medisinskVilkår.less';

const tabs = ['Tilsyn og pleie', 'To omsorgspersoner'];
const MedisinskVilkår = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <>
            <Box marginTop={Margin.large}>
                <Parter />
            </Box>
            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
                <div style={{ marginTop: '1rem' }}>
                    <TabsPure
                        kompakt={true}
                        tabs={tabs.map((tabName, index) => ({ label: tabName, aktiv: activeTab === index }))}
                        onChange={(event, clickedIndex) => setActiveTab(clickedIndex)}
                    />
                    <div className={styles.medisinskVilkår__vilkårContentContainer}>
                        {activeTab === 0 && <VilkårsvurderingAvTilsynOgPleie onVilkårVurdert={() => setActiveTab(1)} />}
                        {activeTab === 1 && <VilkårsvurderingAvToOmsorgspersoner />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MedisinskVilkår;
