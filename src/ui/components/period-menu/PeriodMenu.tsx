import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import Vurdering from '../../../types/Vurdering';
import InteractiveList from '../interactive-list/InteractiveList';
import { prettifyPeriod } from '../../../util/formats';
import GreenCheckIcon from '../icons/GreenCheckIcon';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';

const navigationTypes = ['Perioder', 'Vurderinger', 'Resultat'];

interface PeriodMenuProps {
    vurderinger: Vurdering[];
    onActiveVurderingChange: (vurdering: Vurdering) => void;
}

const PeriodMenu = ({ vurderinger, onActiveVurderingChange }: PeriodMenuProps) => {
    const [activeTab, setActiveTab] = React.useState(0);

    const allePerioder = vurderinger
        .map((vurdering) =>
            vurdering.perioder.map((periode, index) => {
                return {
                    contentRenderer: () => (
                        <>
                            <GreenCheckIconFilled />
                            {prettifyPeriod(periode)} Innvilget
                        </>
                    ),
                    vurdering,
                    onClick: (element) => onActiveVurderingChange(element.vurdering),
                    key: `${index}`,
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
            {activeTab === 0 && <InteractiveList elements={allePerioder} />}
        </div>
    );
};

export default PeriodMenu;
