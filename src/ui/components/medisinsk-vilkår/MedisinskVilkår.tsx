import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { TabsPure } from 'nav-frontend-tabs';
import styles from './medisinskVilkår.less';
import VurderingAvTilsynOgPleie from '../vurdering-av-tilsyn-og-pleie/VurderingAvTilsynOgPleie';

const tabs = ['Legeerklæringer', 'Tilsyn og pleie', 'To omsorgspersoner', 'Beredskap og nattevåk'];
const MedisinskVilkår = () => {
    const [activeTab, setActiveTab] = React.useState(1);

    return (
        <div className={styles.medisinskVilkår}>
            <Systemtittel>Sykdom</Systemtittel>
            <TabsPure
                kompakt={true}
                tabs={tabs.map((tabName, index) => ({ label: tabName, aktiv: activeTab === index }))}
                onChange={(event, clickedIndex) => setActiveTab(clickedIndex)}
            />
            {activeTab === 0 && <p>Plotte legeerklæring</p>}
            {activeTab === 1 && <VurderingAvTilsynOgPleie />}
            {activeTab === 2 && <p>To omsorgspersoner</p>}
            {activeTab === 3 && <p>Beredskap og nattevåk</p>}
        </div>
    );
};

export default MedisinskVilkår;
