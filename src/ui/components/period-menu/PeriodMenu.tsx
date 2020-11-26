import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import Vurdering from '../../../types/Vurdering';
import InteractiveList from '../interactive-list/InteractiveList';
import { prettifyPeriod } from '../../../util/formats';

const navigationTypes = ['Perioder', 'Vurderinger', 'Resultat'];

interface PeriodMenuProps {
    vurderinger: Vurdering[];
    onActiveVurderingChange: (vurdering: Vurdering) => void;
}

const PeriodMenu = ({ vurderinger, onActiveVurderingChange }: PeriodMenuProps) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const allePerioder = vurderinger
        .map((vurdering) =>
            vurdering.perioder.map((periode) => {
                return {
                    elementRenderer: () => prettifyPeriod(periode),
                    vurdering,
                };
            })
        )
        .flat();

    return (
        <div className="periodMenu">
            <TabsPure
                kompakt={true}
                tabs={navigationTypes.map((label, index) => ({ label, aktiv: activeTab === index }))}
                onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
            />
            {activeTab === 0 && (
                <InteractiveList
                    elements={allePerioder}
                    onElementClick={(element) => onActiveVurderingChange(element.vurdering)}
                />
            )}
        </div>
    );
};

export default PeriodMenu;
