import { TabsPure } from 'nav-frontend-tabs';
import { Systemtittel } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import Legeerklæring from './Legeerklæring';
import styles from './medisinskVilkar.less';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';

const tabs = ['Legeerklæring', 'Vilkårsvurdering'];

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div style={{ margin: '2rem' }}>
            <div className={styles.headingContainer}>
                <Systemtittel>Fakta</Systemtittel>
            </div>
            <div className={styles.fieldContainerLarge}>
                <TabsPure
                    tabs={tabs.map((tab, index) => ({
                        aktiv: activeTab === index,
                        label: tab,
                    }))}
                    onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
                />
                <div className={styles.fieldContainerLarge}>
                    <div className={activeTab === 0 ? '' : styles.hide}>
                        <Legeerklæring thisTab={0} changeTab={setActiveTab} sykdom={sykdom} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainComponent;
