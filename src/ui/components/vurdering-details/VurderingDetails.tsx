import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import styles from './vurderingDetails.less';

interface VurderingDetailsProps {
    vurdering: Vurdering;
}

const VurderingDetails = ({ vurdering: { perioder, begrunnelse, resultat } }: VurderingDetailsProps) => {
    return (
        <div className={styles.vurderingDetails}>
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

export default VurderingDetails;
