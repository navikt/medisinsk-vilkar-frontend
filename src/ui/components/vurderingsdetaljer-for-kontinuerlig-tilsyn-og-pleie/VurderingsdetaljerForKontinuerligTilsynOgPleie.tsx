import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import styles from './vurderingsdetaljerForKontinuerligTilsynOgPleie.less';
import DetailView from '../detail-view/DetailView';

interface VurderingsdetaljerForKontinuerligTilsynOgPleieProps {
    vurdering: Vurdering;
}

const VurderingsdetaljerForKontinuerligTilsynOgPleie = ({
    vurdering: { perioder, begrunnelse, resultat },
}: VurderingsdetaljerForKontinuerligTilsynOgPleieProps) => {
    return (
        <DetailView title="Vurdering av behov for kontinuerlig tilsyn og pleie">
            <p className={styles.begrunnelse}>{begrunnelse}</p>
            <p>{resultat}</p>
            <ul>
                {perioder.map((periode, i) => (
                    <li key={`${i}`}>{prettifyPeriod(periode)}</li>
                ))}
            </ul>
        </DetailView>
    );
};

export default VurderingsdetaljerForKontinuerligTilsynOgPleie;
