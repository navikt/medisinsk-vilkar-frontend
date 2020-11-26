import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import OldVersion from './OldVersion';
import NewVersion from './NewVersion';
import ContainerContext from './context/ContainerContext';
import ContainerContract from '../types/ContainerContract';
import mockedSykdom from '../mock/mockedSykdom';

interface MainComponentProps {
    containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => {
    const [activeTab, setActiveTab] = React.useState(1);

    return (
        <div style={{ padding: '1rem' }}>
            <TabsPure
                kompakt={true}
                tabs={[
                    { label: 'Gammel versjon', aktiv: activeTab === 0 },
                    { label: 'Ny versjon', aktiv: activeTab === 1 },
                ]}
                onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
            />
            {activeTab === 0 && <OldVersion sykdom={mockedSykdom} />}
            {activeTab === 1 && (
                <ContainerContext.Provider value={containerData}>
                    <NewVersion />
                </ContainerContext.Provider>
            )}
        </div>
    );
};

export default MainComponent;
