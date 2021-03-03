import { EtikettFokus } from 'nav-frontend-etiketter';
import React from 'react';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import OnePersonIconGray from '../icons/OnePersonIconGray';
import WarningIcon from '../icons/WarningIcon';
import styles from './perioderSomSkalVurderes.less';

interface PerioderSomSkalVurderesProps {
    perioder: Period[];
    visParterLabel?: boolean;
}

const PerioderSomSkalVurderes = ({ perioder, visParterLabel }: PerioderSomSkalVurderesProps) => {
    return (
        <div className={styles.perioderSomSkalVurderes}>
            <span className={styles.visuallyHidden}>Type</span>
            <ContentWithTooltip tooltipText="Perioden må vurderes">
                <WarningIcon />
            </ContentWithTooltip>
            <div className={styles.perioderSomSkalVurderes__texts}>
                <div>
                    {perioder.map((periode, index) => (
                        <p
                            key={`${periode.fom}_${periode.tom}`}
                            className={styles.perioderSomSkalVurderes__texts__period}
                        >
                            {index === 0 && <span className={styles.visuallyHidden}>Perioder</span>}
                            {prettifyPeriod(periode)}
                        </p>
                    ))}
                </div>
                {visParterLabel && (
                    <div className={styles.perioderSomSkalVurderes__texts__parterIcon}>
                        <span className={styles.visuallyHidden}>Parter</span>
                        <ContentWithTooltip tooltipText="Søker">
                            <OnePersonIconGray />
                        </ContentWithTooltip>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerioderSomSkalVurderes;
