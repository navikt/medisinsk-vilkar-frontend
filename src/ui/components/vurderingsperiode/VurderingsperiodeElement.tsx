import React from 'react';
import { Period } from '../../../types/Period';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { prettifyPeriod } from '../../../util/formats';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import OnePersonIconBlue from '../icons/OnePersonIconBlue';
import OnePersonOutline from '../icons/OnePersonOutline';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';
import TwoPersonsWithOneHighlightedIconBlue from '../icons/TwoPersonsWithOneHighlightedIconBlue';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
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
        return <GreenCheckIconFilled />;
    }
    if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
        return <RedCrossIconFilled />;
    }
    return null;
};

const renderResultatText = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.OPPFYLT) {
        return <span>Oppfylt</span>;
    }
    if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
        return <span>Ikke oppfylt</span>;
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
                    <OnePersonOutline />
                </ContentWithTooltip>
            );
        }
        return (
            <ContentWithTooltip tooltipText="Søker">
                <OnePersonIconBlue />
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
                <p className={styles.vurderingsperiodeElement__texts__resultat}>
                    <span className={styles.visuallyHidden}>Resultat</span>
                    {renderResultatText(resultat)}
                </p>
            </div>
            {renderAfterElement && renderAfterElement()}
        </div>
    );
};

export default VurderingsperiodeElement;
