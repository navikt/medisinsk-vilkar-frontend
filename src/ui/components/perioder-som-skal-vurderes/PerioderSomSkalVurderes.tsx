import React from 'react';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { prettifyPeriod } from '../../../util/formats';
import WarningIcon from '../icons/WarningIcon';
import { Period } from '../../../types/Period';
import styles from './perioderSomSkalVurderes.less';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import OnePersonIconBlue from '../icons/OnePersonIconBlue';

interface PerioderSomSkalVurderesProps {
    perioder: Period[];
    visParterLabel?: boolean;
}

const PerioderSomSkalVurderes = ({ perioder, visParterLabel }: PerioderSomSkalVurderesProps) => {
    return (
        <div className={styles.perioderSomSkalVurderes}>
            <span className={styles.visuallyHidden}>Type</span>
            <WarningIcon />
            <div className={styles.perioderSomSkalVurderes__texts}>
                {perioder.map((periode, index) => (
                    <p key={`${periode.fom}_${periode.tom}`} className={styles.perioderSomSkalVurderes__texts__period}>
                        {index === 0 && <span className={styles.visuallyHidden}>Perioder</span>}
                        {prettifyPeriod(periode)}
                    </p>
                ))}
                {visParterLabel && (
                    <div className={styles.perioderSomSkalVurderes__texts__parterIcon}>
                        <span className={styles.visuallyHidden}>Parter</span>
                        <ContentWithTooltip tooltipText="Søker">
                            <OnePersonIconBlue />
                        </ContentWithTooltip>
                    </div>
                )}
            </div>
            <div className={styles.perioderSomSkalVurderes__etikett}>
                <EtikettFokus mini>Må vurderes</EtikettFokus>
            </div>
        </div>
    );
};

export default PerioderSomSkalVurderes;
