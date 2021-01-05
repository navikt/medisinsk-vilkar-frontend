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
    etikett?: string;
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

const VurderingsperiodeElement = ({ periode, resultat, etikett }: VurderingsperiodeElementProps) => {
    return (
        <div className={styles.vurderingsperiodeElement}>
            {renderIcon(resultat)}
            <div className={styles.vurderingsperiodeElement__texts}>
                <p className={styles.vurderingsperiodeElement__texts__period}>{prettifyPeriod(periode)}</p>
                {renderResultatText(resultat)}
            </div>
            {etikett && (
                <div className={styles.vurderingsperiodeElement__etikett}>
                    <EtikettInfo mini>{etikett}</EtikettInfo>
                </div>
            )}
        </div>
    );
};

export default VurderingsperiodeElement;
