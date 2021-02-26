import React from 'react';
import { Period } from '../../../types/Period';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { prettifyPeriod } from '../../../util/formats';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import OnePersonIconGray from '../icons/OnePersonIconGray';
import OnePersonOutlineGray from '../icons/OnePersonOutlineGray';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';
import TwoPersonsWithOneHighlightedIconBlue from '../icons/TwoPersonsWithOneHighlightedIconBlue';
import styles from './vurderingsperiodeElement.less';

interface VurderingsperiodeElementProps {
    periode: Period;
    resultat: Vurderingsresultat;
    gjelderForAnnenPart?: boolean;
    gjelderForSøker?: boolean;
    renderAfterElement?: () => React.ReactNode;
    visParterLabel?: boolean;
}

const renderIcon = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.OPPFYLT) {
        return (
            <ContentWithTooltip tooltipText="Vilkåret er oppfylt">
                <GreenCheckIconFilled />
            </ContentWithTooltip>
        );
    }
    if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
        return (
            <ContentWithTooltip tooltipText="Vilkåret er ikke oppfylt">
                <RedCrossIconFilled />
            </ContentWithTooltip>
        );
    }
    return null;
};

const VurderingsperiodeElement = ({
    periode,
    resultat,
    renderAfterElement,
    gjelderForAnnenPart,
    gjelderForSøker,
    visParterLabel,
}: VurderingsperiodeElementProps): JSX.Element => {
    const parterLabel = () => {
        if (gjelderForAnnenPart && gjelderForSøker) {
            return (
                <ContentWithTooltip tooltipText="Søker og annen part">
                    <TwoPersonsWithOneHighlightedIconBlue />
                </ContentWithTooltip>
            );
        }
        if (gjelderForAnnenPart) {
            return (
                <ContentWithTooltip tooltipText="Annen part">
                    <OnePersonOutlineGray />
                </ContentWithTooltip>
            );
        }
        return (
            <ContentWithTooltip tooltipText="Søker">
                <OnePersonIconGray />
            </ContentWithTooltip>
        );
    };

    return (
        <div className={styles.vurderingsperiodeElement}>
            <span className={styles.visuallyHidden}>Type</span>
            {renderIcon(resultat)}
            <div className={styles.vurderingsperiodeElement__texts}>
                <p className={styles.vurderingsperiodeElement__texts__period}>
                    <span className={styles.visuallyHidden}>Periode</span>
                    {prettifyPeriod(periode)}
                </p>
                {visParterLabel && (
                    <div className={styles.vurderingsperiodeElement__texts__parterIcon}>
                        <span className={styles.visuallyHidden}>Parter</span>
                        {parterLabel()}
                    </div>
                )}
            </div>
            {renderAfterElement && renderAfterElement()}
        </div>
    );
};

export default VurderingsperiodeElement;
