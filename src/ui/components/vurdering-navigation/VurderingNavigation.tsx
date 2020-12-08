import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import Vurdering from '../../../types/Vurdering';
import styles from './vurderingNavigation.less';
import InteractiveList from '../interactive-list/InteractiveList';
import { sammenstillVurderingsperioder } from '../../../util/vurderingsperioderUtils';
import Vurderingsperiode from '../vurderingsperiode/Vurderingsperiode';
import { prettifyPeriod } from '../../../util/formats';
import { Period } from '../../../types/Period';
import PerioderSomSkalVurderes from '../perioder-som-skal-vurderes/PerioderSomSkalVurderes';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

interface VurderingNavigationProps {
    vurderinger: Vurdering[];
    onNyVurderingClick: () => void;
    onVurderingValgt: (vurdering: Vurdering) => void;
    perioderSomSkalVurderes?: Period[];
    onPerioderSomSkalVurderesClick?: () => void;
    kanOppretteNyeVurderinger?: boolean;
}

const VurderingNavigation = ({
    vurderinger,
    onNyVurderingClick,
    onVurderingValgt,
    perioderSomSkalVurderes,
    onPerioderSomSkalVurderesClick,
    kanOppretteNyeVurderinger,
}: VurderingNavigationProps) => {
    function configureVurdertPeriodeElement({ periode, vurdering }, selectCallback) {
        return {
            contentRenderer: () => <Vurderingsperiode periode={periode} resultat={vurdering.resultat} />,
            vurdering,
            onClick: (element) => selectCallback(element.vurdering),
            key: prettifyPeriod(periode),
        };
    }

    function configurePerioderSomSkalVurderesElement() {
        return {
            contentRenderer: () => <PerioderSomSkalVurderes perioder={perioderSomSkalVurderes || []} />,
            onClick: onPerioderSomSkalVurderesClick,
            key: 'foobar',
        };
    }

    const interactiveListElements = React.useMemo(() => {
        const vurdertePerioderElements = sammenstillVurderingsperioder(vurderinger).map((vurderingsperiode) =>
            configureVurdertPeriodeElement(vurderingsperiode, onVurderingValgt)
        );

        if (perioderSomSkalVurderes && perioderSomSkalVurderes.length > 0) {
            const perioderSomSkalVurderesElement = configurePerioderSomSkalVurderesElement();
            return [perioderSomSkalVurderesElement, ...vurdertePerioderElements];
        }

        return vurdertePerioderElements;
    }, [vurderinger, perioderSomSkalVurderes]);

    return (
        <>
            <Undertittel>Alle perioder</Undertittel>
            {kanOppretteNyeVurderinger && (
                <Knapp
                    className={styles.nyVurderingKnapp}
                    type="standard"
                    htmlType="button"
                    mini={true}
                    onClick={() => onNyVurderingClick()}
                >
                    Opprett ny vurdering
                </Knapp>
            )}
            <div className={styles.vurderingsvelgerContainer}>
                <InteractiveList elements={interactiveListElements} />
            </div>
            {!kanOppretteNyeVurderinger && (
                <div style={{ marginTop: '1rem' }}>
                    <AlertStripeInfo>
                        Ingen perioder å vurdere. Tilsyn og pleie må være innvilget før man kan vurdere to
                        omsorgspersoner.
                    </AlertStripeInfo>
                </div>
            )}
        </>
    );
};

export default VurderingNavigation;
