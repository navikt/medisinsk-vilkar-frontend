import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import InteractiveList from '../interactive-list/InteractiveList';
import NyVurderingKnapp from '../ny-vurdering-knapp/NyVurderingKnapp';
import PerioderSomSkalVurderes from '../perioder-som-skal-vurderes/PerioderSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './vurderingsnavigasjon.less';

interface VurderingsnavigasjonProps {
    vurderingselementer: Vurderingselement[];
    onNyVurderingClick: (perioder?: Period[]) => void;
    onVurderingValgt: (vurdering: Vurderingselement) => void;
    resterendeVurderingsperioder?: Period[];
    søknadsperioderTilBehandling?: Period[];
}

const harOverlapp = (periode: Period, søknadsperiode: Period) =>
    søknadsperiode.covers(periode) || søknadsperiode.overlapsLeft(periode) || søknadsperiode.overlapsRight(periode);

const Vurderingsnavigasjon = ({
    vurderingselementer,
    onNyVurderingClick,
    onVurderingValgt,
    resterendeVurderingsperioder,
    søknadsperioderTilBehandling,
}: VurderingsnavigasjonProps): JSX.Element => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const harPerioderSomSkalVurderes = resterendeVurderingsperioder?.length > 0;

    const sorterteVurderingselementer: Vurderingselement[] = React.useMemo(() => {
        return vurderingselementer.sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode)).reverse();
    }, [vurderingselementer]);

    const vurderingsperiodeElements = sorterteVurderingselementer.map(
        ({ periode, resultat, gjelderForAnnenPart, gjelderForSøker }) => (
            <VurderingsperiodeElement
                periode={periode}
                resultat={resultat}
                harOverlapp={
                    harPerioderSomSkalVurderes &&
                    søknadsperioderTilBehandling.some((søknadsperiode: Period) => harOverlapp(periode, søknadsperiode))
                }
                gjelderForAnnenPart={gjelderForAnnenPart}
                gjelderForSøker={gjelderForSøker}
            />
        )
    );

    const allElements = [...vurderingsperiodeElements];
    if (harPerioderSomSkalVurderes) {
        allElements.unshift(<PerioderSomSkalVurderes perioder={resterendeVurderingsperioder || []} />);
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
                                onVurderingValgt(sorterteVurderingselementer[vurderingsperiodeIndex]);
                            } else {
                                onNyVurderingClick(resterendeVurderingsperioder);
                            }
                        },
                    }))}
                />
            </div>
        </>
    );
};

export default Vurderingsnavigasjon;
