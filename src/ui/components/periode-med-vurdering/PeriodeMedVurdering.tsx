import React from 'react';
import styles from './periodeMedVurdering.less';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import { prettifyPeriod } from '../../../util/formats';
import { Period } from '../../../types/Period';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';

interface PeriodeMedVurderingProps {
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

const PeriodeMedVurdering = ({ periode, resultat }: PeriodeMedVurderingProps) => {
    return (
        <div className={styles.periodeMedVurdering}>
            {renderIcon(resultat)}
            <div className={styles.periodeMedVurdering__texts}>
                <p className={styles.periodeMedVurdering__texts__period}>{prettifyPeriod(periode)}</p>
                {renderResultatText(resultat)}
            </div>
        </div>
    );
};

export default PeriodeMedVurdering;
