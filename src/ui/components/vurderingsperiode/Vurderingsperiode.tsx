import React from 'react';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import { prettifyPeriod } from '../../../util/formats';
import { Period } from '../../../types/Period';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';
import styles from './vurderingsperiode.less';

interface VurderingsperiodeProps {
    periode: Period;
    resultat: Vurderingsresultat;
}

const renderIcon = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.INNVILGET) {
        return <GreenCheckIconFilled />;
    } else if (resultat === Vurderingsresultat.AVSLÅTT) {
        return <RedCrossIconFilled />;
    }
};

const renderResultatText = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.INNVILGET) {
        return <span>Innvilget</span>;
    } else if (resultat === Vurderingsresultat.AVSLÅTT) {
        return <span>Avslått</span>;
    }
};

const Vurderingsperiode = ({ periode, resultat }: VurderingsperiodeProps) => {
    return (
        <div className={styles.vurderingsperiode}>
            {renderIcon(resultat)}
            <div className={styles.vurderingsperiode__texts}>
                <p className={styles.vurderingsperiode__texts__period}>{prettifyPeriod(periode)}</p>
                {renderResultatText(resultat)}
            </div>
        </div>
    );
};

export default Vurderingsperiode;
