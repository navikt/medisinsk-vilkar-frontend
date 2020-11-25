import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import OldVersion from './OldVersion';
import NewVersion from './NewVersion';

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = React.useState(1);

    return (
        <div style={{ padding: '1rem' }}>
            <TabsPure
                tabs={[
                    { label: 'Gammel versjon', aktiv: activeTab === 0 },
                    { label: 'Ny versjon', aktiv: activeTab === 1 },
                ]}
                onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
            />
            {activeTab === 0 && <OldVersion sykdom={sykdom} />}
            {activeTab === 1 && <NewVersion />}
        </div>
    );
};

export default MainComponent;
