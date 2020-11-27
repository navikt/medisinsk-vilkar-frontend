import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import styles from './vurderingsdetaljer.less';

interface VurderingDetailsProps {
    vurdering: Vurdering;
}

const Vurderingsdetaljer = ({ vurdering: { perioder, begrunnelse, resultat } }: VurderingDetailsProps) => {
    return (
        <div className={styles.vurderingDetails} key={begrunnelse}>
            <p className={styles.begrunnelse}>{begrunnelse}</p>
            <p>{resultat}</p>
            <ul>
                {perioder.map((periode, i) => (
                    <li key={`${i}`}>{prettifyPeriod(periode)}</li>
                ))}
            </ul>
        </div>
    );
};

export default Vurderingsdetaljer;
