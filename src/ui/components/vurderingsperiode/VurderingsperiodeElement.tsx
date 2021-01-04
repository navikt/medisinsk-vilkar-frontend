import { EtikettInfo } from 'nav-frontend-etiketter';
import React from 'react';
import { Period } from '../../../types/Period';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { prettifyPeriod } from '../../../util/formats';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';
import styles from './vurderingsperiodeElement.less';

interface VurderingsperiodeElementProps {
    periode: Period;
    resultat: Vurderingsresultat;
    harOverlapp?: boolean;
}

const renderIcon = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.INNVILGET) {
        return <GreenCheckIconFilled />;
    }
    if (resultat === Vurderingsresultat.AVSLÅTT) {
        return <RedCrossIconFilled />;
    }
};

const renderResultatText = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.INNVILGET) {
        return <span>Innvilget</span>;
    }
    if (resultat === Vurderingsresultat.AVSLÅTT) {
        return <span>Avslått</span>;
    }
};

const VurderingsperiodeElement = ({ periode, resultat, harOverlapp }: VurderingsperiodeElementProps) => {
    return (
        <div className={styles.vurderingsperiodeElement}>
            {renderIcon(resultat)}
            <div className={styles.vurderingsperiodeElement__texts}>
                <p className={styles.vurderingsperiodeElement__texts__period}>{prettifyPeriod(periode)}</p>
                {renderResultatText(resultat)}
            </div>
            {harOverlapp && (
                <div className={styles.vurderingsperiodeElement__etikett}>
                    <EtikettInfo mini>Overlapp</EtikettInfo>
                </div>
            )}
        </div>
    );
};

export default VurderingsperiodeElement;
