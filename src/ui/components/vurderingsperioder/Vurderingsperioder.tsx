import React from 'react';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import OnePersonIconGray from '../icons/OnePersonIconGray';
import styles from './vurderingsperioder.less';

interface VurderingsperioderProps {
    perioder: Period[];
    visParterLabel?: boolean;
    indicatorContentRenderer?: () => React.ReactNode;
}

const Vurderingsperioder = ({ perioder, visParterLabel, indicatorContentRenderer }: VurderingsperioderProps) => (
    <div className={styles.vurderingsperioder} id="vurderingsperioder">
        {indicatorContentRenderer && indicatorContentRenderer()}

        <div className={styles.vurderingsperioder__texts}>
            <div>
                {perioder.map((periode, index) => (
                    <p key={`${periode.fom}_${periode.tom}`} className={styles.vurderingsperioder__texts__period}>
                        {index === 0 && <span className={styles.visuallyHidden}>Perioder</span>}
                        {prettifyPeriod(periode)}
                    </p>
                ))}
            </div>
            {visParterLabel && (
                <div className={styles.vurderingsperioder__texts__parterIcon}>
                    <span className={styles.visuallyHidden}>Parter</span>
                    <ContentWithTooltip tooltipText="Søker">
                        <OnePersonIconGray />
                    </ContentWithTooltip>
                </div>
            )}
        </div>
    </div>
);

export default Vurderingsperioder;
