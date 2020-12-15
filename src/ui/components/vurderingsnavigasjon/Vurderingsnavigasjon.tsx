import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Vurdering from '../../../types/Vurdering';
import InteractiveList from '../interactive-list/InteractiveList';
import { Vurderingsperiode, sammenstillVurderingsperioder } from '../../../util/vurderingsperioderUtils';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import { Period } from '../../../types/Period';
import PerioderSomSkalVurderes from '../perioder-som-skal-vurderes/PerioderSomSkalVurderes';
import styles from './vurderingsnavigasjon.less';
import NyVurderingKnapp from '../ny-vurdering-knapp/NyVurderingKnapp';

interface VurderingsnavigasjonProps {
    vurderinger: Vurdering[];
    onNyVurderingClick: (perioder?: Period[]) => void;
    onVurderingValgt: (vurdering: Vurdering) => void;
    perioderSomSkalVurderes?: Period[];
}

const Vurderingsnavigasjon = ({
    vurderinger,
    onNyVurderingClick,
    onVurderingValgt,
    perioderSomSkalVurderes,
}: VurderingsnavigasjonProps) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const harPerioderSomSkalVurderes = perioderSomSkalVurderes && perioderSomSkalVurderes.length > 0;

    const vurderingsperioder: Vurderingsperiode[] = React.useMemo(() => {
        return sammenstillVurderingsperioder(vurderinger);
    }, [vurderinger]);

    const vurderingsperiodeElements = vurderingsperioder.map(({ periode, vurdering }) => (
        <VurderingsperiodeElement periode={periode} resultat={vurdering.resultat} />
    ));

    const allElements = [...vurderingsperiodeElements];
    if (harPerioderSomSkalVurderes) {
        allElements.unshift(<PerioderSomSkalVurderes perioder={perioderSomSkalVurderes || []} />);
    }

    return (
        <>
            <Undertittel>Alle perioder</Undertittel>
            {!harPerioderSomSkalVurderes && (
                <NyVurderingKnapp
                    onClick={() => {
                        setActiveIndex(-1);
                        onNyVurderingClick();
                    }}
                />
            )}
            <div className={styles.vurderingsvelgerContainer}>
                <InteractiveList
                    elements={allElements.map((element, currentIndex) => ({
                        content: element,
                        active: activeIndex === currentIndex,
                        key: `${currentIndex}`,
                        onClick: () => {
                            setActiveIndex(currentIndex);

                            const vurderingsperiodeIndex = vurderingsperiodeElements.indexOf(element);
                            const erEnEksisterendeVurdering = vurderingsperiodeIndex > -1;
                            if (erEnEksisterendeVurdering) {
                                onVurderingValgt(vurderingsperioder[vurderingsperiodeIndex].vurdering);
                            } else {
                                onNyVurderingClick(perioderSomSkalVurderes);
                            }
                        },
                    }))}
                />
            </div>
        </>
    );
};

export default Vurderingsnavigasjon;
