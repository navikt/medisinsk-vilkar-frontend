import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { TabsPure } from 'nav-frontend-tabs';
import styles from './medisinskVilkår.less';
import VurderingAvTilsynOgPleie from '../vurdering-av-tilsyn-og-pleie/VurderingAvTilsynOgPleie';

const tabs = ['Tilsyn og pleie', 'To omsorgspersoner', 'Beredskap og nattevåk'];
const MedisinskVilkår = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className={styles.medisinskVilkår}>
            <Systemtittel>Sykdom</Systemtittel>
            <div style={{ marginTop: '1rem' }}>
                <TabsPure
                    kompakt={true}
                    tabs={tabs.map((tabName, index) => ({ label: tabName, aktiv: activeTab === index }))}
                    onChange={(event, clickedIndex) => setActiveTab(clickedIndex)}
                />
                <div style={{ marginTop: '1rem' }}>
                    {activeTab === 0 && <VurderingAvTilsynOgPleie />}
                    {activeTab === 1 && <p>To omsorgspersoner</p>}
                    {activeTab === 2 && <p>Beredskap og nattevåk</p>}
                </div>
            </div>
        </div>
    );
};

export default MedisinskVilkår;
