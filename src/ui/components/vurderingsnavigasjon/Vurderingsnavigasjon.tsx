import { EtikettInfo } from 'nav-frontend-etiketter';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import ManuellVurdering from '../../../types/ManuellVurdering';
import { Period } from '../../../types/Period';
import Vurderingselement from '../../../types/Vurderingselement';
import { usePrevious } from '../../../util/hooks';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import AddButton from '../add-button/AddButton';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import EditedBySaksbehandlerIcon from '../icons/EditedBySaksbehandlerIcon';
import InteractiveList from '../interactive-list/InteractiveList';
import PerioderSomSkalVurderes from '../perioder-som-skal-vurderes/PerioderSomSkalVurderes';
import VurderingsperiodeElement from '../vurderingsperiode/VurderingsperiodeElement';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './vurderingsnavigasjon.less';

interface VurderingsnavigasjonProps {
    vurderingselementer: Vurderingselement[];
    onNyVurderingClick: (perioder?: Period[]) => void;
    onVurderingValgt: (vurdering: Vurderingselement) => void;
    resterendeVurderingsperioder?: Period[];
    visRadForNyVurdering?: boolean;
    visParterLabel?: boolean;
    visOpprettVurderingKnapp?: boolean;
}

const Vurderingsnavigasjon = ({
    vurderingselementer,
    onNyVurderingClick,
    onVurderingValgt,
    resterendeVurderingsperioder,
    visRadForNyVurdering,
    visParterLabel,
    visOpprettVurderingKnapp,
}: VurderingsnavigasjonProps): JSX.Element => {
    const harPerioderSomSkalVurderes = resterendeVurderingsperioder?.length > 0;
    const [activeIndex, setActiveIndex] = React.useState(harPerioderSomSkalVurderes ? 0 : -1);
    const previousVisRadForNyVurdering = usePrevious(visRadForNyVurdering);

    useEffect(() => {
        if (visRadForNyVurdering === false && previousVisRadForNyVurdering === true) {
            setActiveIndex(-1);
        }
    }, [visRadForNyVurdering]);

    const sorterteVurderingselementer: Vurderingselement[] = React.useMemo(() => {
        return vurderingselementer.sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode)).reverse();
    }, [vurderingselementer]);

    const vurderingsperiodeElements = sorterteVurderingselementer.map((vurderingsperiode) => {
        const visOverlappetikett =
            harPerioderSomSkalVurderes &&
            resterendeVurderingsperioder.some((søknadsperiode: Period) =>
                søknadsperiode.overlapsWith(vurderingsperiode.periode)
            );

        return (
            <VurderingsperiodeElement
                vurderingselement={vurderingsperiode}
                visParterLabel={visParterLabel}
                renderAfterElement={() => (
                    <div className={styles.vurderingsperiode__postElementContainer}>
                        {(vurderingsperiode as ManuellVurdering).endretIDenneBehandlingen && (
                            <ContentWithTooltip tooltipText="Vurderingen er opprettet i denne behandlingen">
                                <EditedBySaksbehandlerIcon />
                            </ContentWithTooltip>
                        )}

                        {visOverlappetikett && <EtikettInfo mini>Overlapp</EtikettInfo>}
                    </div>
                )}
            />
        );
    });

    const allElements = [...vurderingsperiodeElements];
    if (harPerioderSomSkalVurderes) {
        allElements.unshift(
            <PerioderSomSkalVurderes visParterLabel={visParterLabel} perioder={resterendeVurderingsperioder || []} />
        );
    }

    if (visRadForNyVurdering) {
        allElements.unshift(<EtikettInfo mini>Ny vurdering</EtikettInfo>);
    }

    return (
        <div className={styles.vurderingsnavigasjon}>
            <div className={styles.vurderingsnavigasjon__headingContainer}>
                <Undertittel className={styles.vurderingsnavigasjon__heading}>Alle perioder</Undertittel>
                {visOpprettVurderingKnapp && (
                    <WriteAccessBoundContent
                        contentRenderer={() => (
                            <AddButton
                                label="Ny vurdering"
                                className={styles.vurderingsnavigasjon__opprettVurderingKnapp}
                                onClick={() => {
                                    setActiveIndex(0);
                                    onNyVurderingClick();
                                }}
                                ariaLabel="Opprett vurdering"
                            />
                        )}
                    />
                )}
            </div>
            {allElements.length === 0 && <p>Ingen vurderinger å vise</p>}
            {allElements.length > 0 && (
                <div className={styles.vurderingsvelgerContainer}>
                    <div className={styles.vurderingsvelgerContainer__columnHeadings}>
                        <Element className={styles['vurderingsvelgerContainer__columnHeading--first']}>Status</Element>
                        <Element className={styles['vurderingsvelgerContainer__columnHeading--second']}>
                            Periode
                        </Element>
                        {visParterLabel && (
                            <Element className={styles['vurderingsvelgerContainer__columnHeading--third']}>
                                Part
                            </Element>
                        )}
                    </div>
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
            )}
        </div>
    );
};

export default Vurderingsnavigasjon;
