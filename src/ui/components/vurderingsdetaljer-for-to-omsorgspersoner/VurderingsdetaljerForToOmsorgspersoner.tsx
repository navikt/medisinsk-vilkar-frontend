import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import DetailView from '../detail-view/DetailView';
import styles from './vurderingsdetaljerForToOmsorgspersoner.less';

interface VurderingsdetaljerForToOmsorgspersonerProps {
    vurdering: Vurdering;
}

const VurderingsdetaljerForToOmsorgspersoner = ({
    vurdering: { perioder, begrunnelse, resultat },
}: VurderingsdetaljerForToOmsorgspersonerProps) => {
    return (
        <DetailView title="Vurdering av to omsorgspersoner">
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

export default VurderingsdetaljerForToOmsorgspersoner;
