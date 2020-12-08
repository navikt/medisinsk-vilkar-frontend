import React from 'react';
import { TabsPure } from 'nav-frontend-tabs';
import VilkårsvurderingAvTilsynOgPleie from '../vilkårsvurdering-av-tilsyn-og-pleie/VilkårsvurderingAvTilsynOgPleie';
import VilkårsvurderingAvToOmsorgspersoner from '../vilkårsvurdering-av-to-omsorgspersoner/VilkårsvurderingAvToOmsorgspersoner';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import styles from './medisinskVilkår.less';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Scenariovelger from './Scenariovelger';

const tabs = ['Tilsyn og pleie', 'To omsorgspersoner'];
const MedisinskVilkår = () => {
    const [activeTab, setActiveTab] = React.useState(0);
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>(null);
    const [scenario, setScenario] = React.useState(0);

    return (
        <>
            <Scenariovelger setScenario={setScenario} />

            <div className={styles.medisinskVilkår}>
                <h1 style={{ fontSize: 22 }}>Sykdom</h1>
                <div style={{ marginTop: '1rem' }}>
                    <TabsPure
                        kompakt={true}
                        tabs={tabs.map((tabName, index) => ({ label: tabName, aktiv: activeTab === index }))}
                        onChange={(event, clickedIndex) => setActiveTab(clickedIndex)}
                    />
                    <div className={styles.medisinskVilkår__vilkårContentContainer}>
                        {activeTab === 0 && (
                            <VilkårsvurderingAvTilsynOgPleie
                                onVilkårVurdert={(nyVurderingsoversikt: Vurderingsoversikt) => {
                                    setVurderingsoversikt(nyVurderingsoversikt);
                                    setActiveTab(1);
                                }}
                                scenario={scenario}
                            />
                        )}
                        {activeTab === 1 && (
                            <VilkårsvurderingAvToOmsorgspersoner
                                defaultVurderingsoversikt={{
                                    vurderinger: [],
                                    perioderSomSkalVurderes:
                                        vurderingsoversikt?.vurderinger
                                            ?.filter(({ resultat }) => resultat === Vurderingsresultat.INNVILGET)
                                            .flatMap(({ perioder }) => perioder) || [],
                                    søknadsperioder: [],
                                    dokumenter: vurderingsoversikt?.dokumenter,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MedisinskVilkår;
