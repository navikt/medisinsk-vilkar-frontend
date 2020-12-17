import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Period } from '../../../types/Period';
import Vurderingsperiode from '../../../types/Vurderingsperiode';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import InteractiveList from '../interactive-list/InteractiveList';
import NyVurderingKnapp from '../ny-vurdering-knapp/NyVurderingKnapp';
import PerioderSomSkalVurderes from '../perioder-som-skal-vurderes/PerioderSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './vurderingsnavigasjon.less';

interface VurderingsnavigasjonProps {
    vurderingsperioder: Vurderingsperiode[];
    onNyVurderingClick: (perioder?: Period[]) => void;
    onVurderingValgt: (vurdering: Vurderingsperiode) => void;
    perioderSomSkalVurderes?: Period[];
}

const Vurderingsnavigasjon = ({
    vurderingsperioder,
    onNyVurderingClick,
    onVurderingValgt,
    perioderSomSkalVurderes,
}: VurderingsnavigasjonProps): JSX.Element => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const harPerioderSomSkalVurderes = perioderSomSkalVurderes && perioderSomSkalVurderes.length > 0;

    const sorterteVurderingsperioder: Vurderingsperiode[] = React.useMemo(() => {
        return vurderingsperioder.sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode)).reverse();
    }, [vurderingsperioder]);

    const vurderingsperiodeElements = sorterteVurderingsperioder.map(({ periode, resultat }) => (
        <VurderingsperiodeElement periode={periode} resultat={resultat} />
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
                                onVurderingValgt(sorterteVurderingsperioder[vurderingsperiodeIndex]);
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
