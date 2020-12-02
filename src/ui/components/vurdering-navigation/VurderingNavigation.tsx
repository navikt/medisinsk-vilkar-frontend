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

interface VurderingNavigationProps {
    perioderSomSkalVurderes?: Period[];
    vurderinger: Vurdering[];
    onNyVurderingClick: () => void;
    onVurderingValgt: (vurdering: Vurdering) => void;
}

const VurderingNavigation = ({
    perioderSomSkalVurderes,
    vurderinger,
    onNyVurderingClick,
    onVurderingValgt,
}: VurderingNavigationProps) => {
    const vurderingselementer = sammenstillVurderingsperioder(vurderinger).map((vurderingsperiode) =>
        configureInteractiveListElement(vurderingsperiode, onVurderingValgt)
    );

    function configureInteractiveListElement({ periode, vurdering }, selectCallback) {
        return {
            contentRenderer: () => <Vurderingsperiode periode={periode} resultat={vurdering.resultat} />,
            vurdering,
            onClick: (element) => selectCallback(element.vurdering),
            key: prettifyPeriod(periode),
        };
    }

    let perioderSomSkalVurderesElement = {
        contentRenderer: () => <PerioderSomSkalVurderes perioder={perioderSomSkalVurderes || []} />,
        onClick: () => onVurderingValgt(null),
        key: 'foobar',
    };

    return (
        <>
            <Undertittel>Alle perioder</Undertittel>
            <Knapp
                className={styles.nyVurderingKnapp}
                type="standard"
                htmlType="button"
                mini={true}
                onClick={() => onNyVurderingClick()}
            >
                Opprett ny vurdering
            </Knapp>
            <div className={styles.vurderingsvelgerContainer}>
                <InteractiveList elements={[perioderSomSkalVurderesElement, ...vurderingselementer]} />
            </div>
        </>
    );
};

export default VurderingNavigation;
