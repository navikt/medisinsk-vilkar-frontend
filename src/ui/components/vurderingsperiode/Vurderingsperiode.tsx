import React from 'react';
import styles from './periodeMedVurdering.less';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import { prettifyPeriod } from '../../../util/formats';
import { Period } from '../../../types/Period';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';
import WarningIcon from '../icons/WarningIcon';

interface VurderingsperiodeProps {
    periode: Period;
    resultat: Vurderingsresultat | null;
}

const renderIcon = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.INNVILGET) {
        return <GreenCheckIconFilled />;
    } else if (resultat === Vurderingsresultat.AVSLÅTT) {
        return <RedCrossIconFilled />;
    } else if (resultat === null) {
        return <WarningIcon />;
    }
};

const renderResultatText = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.INNVILGET) {
        return <span>Innvilget</span>;
    } else if (resultat === Vurderingsresultat.AVSLÅTT) {
        return <span>Avslått</span>;
    } else if (resultat === null) {
        return <span>Ikke vurdert</span>;
    }
};

const Vurderingsperiode = ({ periode, resultat }: VurderingsperiodeProps) => {
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

export default Vurderingsperiode;
