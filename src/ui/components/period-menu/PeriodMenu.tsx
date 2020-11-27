import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import Vurdering from '../../../types/Vurdering';
import InteractiveList from '../interactive-list/InteractiveList';
import PeriodeMedVurdering from '../periode-med-vurdering/PeriodeMedVurdering';
import styles from './periodMenu.less';

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
                    contentRenderer: () => <PeriodeMedVurdering periode={periode} resultat={vurdering.resultat} />,
                    vurdering,
                    onClick: (element) => onActiveVurderingChange(element.vurdering),
                    key: `${index}`,
                };
            })
        )
        .flat();

    return (
        <>
            {activeTab === 0 && <InteractiveList elements={allePerioder} />}
            <div className={styles.periodMenu__invisibleTabs}>
                <TabsPure
                    kompakt={true}
                    tabs={navigationTypes.map((label, index) => ({ label, aktiv: activeTab === index }))}
                    onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
                />
            </div>
        </>
    );
};

export default PeriodMenu;
