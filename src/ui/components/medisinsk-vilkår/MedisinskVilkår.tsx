import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import VurderingAvTilsynOgPleie from '../vurdering-av-tilsyn-og-pleie/VurderingAvTilsynOgPleie';
import styles from './medisinskVilkår.less';

const tabs = ['Tilsyn og pleie', 'To omsorgspersoner', 'Beredskap og nattevåk'];
const MedisinskVilkår = () => {
    const [activeTab, setActiveTab] = React.useState(0);

    return (
        <div className={styles.medisinskVilkår}>
            <h1 style={{ fontSize: 22 }}>Sykdom</h1>
            <div style={{ marginTop: '1rem' }}>
                <TabsPure
                    kompakt={true}
                    tabs={tabs.map((tabName, index) => ({ label: tabName, aktiv: activeTab === index }))}
                    onChange={(event, clickedIndex) => setActiveTab(clickedIndex)}
                />
                <div className={styles.medisinskVilkår__vilkårContentContainer}>
                    {activeTab === 0 && <VurderingAvTilsynOgPleie />}
                    {activeTab === 1 && <p>To omsorgspersoner</p>}
                    {activeTab === 2 && <p>Beredskap og nattevåk</p>}
                </div>
            </div>
        </div>
    );
};

export default MedisinskVilkår;
