import { EtikettInfo } from 'nav-frontend-etiketter';
import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import IconWithTooltip from '../icon-with-tooltip/IconWithTooltip';
import EditedBySaksbehandlerIcon from '../icons/EditedBySaksbehandlerIcon';
import InteractiveList from '../interactive-list/InteractiveList';
import NyVurderingKnapp from '../ny-vurdering-knapp/NyVurderingKnapp';
import PerioderSomSkalVurderes from '../perioder-som-skal-vurderes/PerioderSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import styles from './vurderingsnavigasjon.less';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';

interface VurderingsnavigasjonProps {
    vurderingselementer: Vurderingselement[];
    onNyVurderingClick: (perioder?: Period[]) => void;
    onVurderingValgt: (vurdering: Vurderingselement) => void;
    resterendeVurderingsperioder?: Period[];
    visRadForNyVurdering?: boolean;
}

const Vurderingsnavigasjon = ({
    vurderingselementer,
    onNyVurderingClick,
    onVurderingValgt,
    resterendeVurderingsperioder,
    visRadForNyVurdering,
}: VurderingsnavigasjonProps): JSX.Element => {
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const harPerioderSomSkalVurderes = resterendeVurderingsperioder?.length > 0;

    const sorterteVurderingselementer: Vurderingselement[] = React.useMemo(() => {
        return vurderingselementer.sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode)).reverse();
    }, [vurderingselementer]);

    const vurderingsperiodeElements = sorterteVurderingselementer.map(
        ({ periode, resultat, gjelderForAnnenPart, gjelderForSøker, endretIDenneBehandlingen }) => {
            const visOverlappetikett =
                harPerioderSomSkalVurderes &&
                resterendeVurderingsperioder.some((søknadsperiode: Period) => søknadsperiode.overlapsWith(periode));

            return (
                <VurderingsperiodeElement
                    periode={periode}
                    resultat={resultat}
                    renderAfterElement={() => (
                        <div className={styles.vurderingsperiode__postElementContainer}>
                            {endretIDenneBehandlingen && (
                                <IconWithTooltip
                                    renderIcon={() => <EditedBySaksbehandlerIcon />}
                                    tooltipText="Saksbehandler har opprettet ny vurdering i denne perioden"
                                />
                            )}

                            {visOverlappetikett && <EtikettInfo mini>Overlapp</EtikettInfo>}
                        </div>
                    )}
                    gjelderForAnnenPart={gjelderForAnnenPart}
                    gjelderForSøker={gjelderForSøker}
                />
            );
        }
    );

    const allElements = [...vurderingsperiodeElements];
    if (harPerioderSomSkalVurderes) {
        allElements.unshift(<PerioderSomSkalVurderes perioder={resterendeVurderingsperioder || []} />);
    }

    if (visRadForNyVurdering) {
        allElements.unshift(<EtikettInfo mini>Ny vurdering</EtikettInfo>);
    }

    return (
        <>
            <Undertittel>Alle perioder</Undertittel>
            <WriteAccessBoundContent
                otherRequirementsAreMet={!harPerioderSomSkalVurderes}
                contentRenderer={() => (
                    <NyVurderingKnapp
                        onClick={() => {
                            setActiveIndex(0);
                            onNyVurderingClick();
                        }}
                    />
                )}
            />
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
                            } else if (visRadForNyVurdering && currentIndex === 0) {
                                onNyVurderingClick();
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
