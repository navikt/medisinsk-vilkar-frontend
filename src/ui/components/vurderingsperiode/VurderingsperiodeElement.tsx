import React from 'react';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import { prettifyPeriod } from '../../../util/formats';
import ContentWithTooltip from '../content-with-tooltip/ContentWithTooltip';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';
import OnePersonIconGray from '../icons/OnePersonIconGray';
import OnePersonOutlineGray from '../icons/OnePersonOutlineGray';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';
import TwoPersonsWithOneHighlightedIconBlue from '../icons/TwoPersonsWithOneHighlightedIconBlue';
import InstitutionIcon from '../icons/InstitutionIcon';
import ManuellVurdering from '../../../types/ManuellVurdering';
import InnleggelsesperiodeIkonOverOppfylt from '../innleggelsesperiode-ikon-over-oppfylt/InnleggelsesperiodeIkonOverOppfylt';
import InnleggelsesperiodeIkonOverIkkeOppfylt from '../innleggelsesperiode-ikon-over-ikkeoppfylt/InnleggelsesperiodeIkonOverOppfylt';
import { Vurderingselement } from '../../../types/Vurderingselement';
import styles from './vurderingsperiodeElement.less';

interface VurderingsperiodeElementProps {
    vurderingselement: Vurderingselement;
    renderAfterElement?: () => React.ReactNode;
    visParterLabel?: boolean;
}

const renderInnleggelsesperiodeIcon = (resultat: Vurderingsresultat) => {
    if (resultat === Vurderingsresultat.OPPFYLT) {
        return (
            <ContentWithTooltip tooltipText="Innleggelsesperiode over oppfylt periode">
                <InnleggelsesperiodeIkonOverOppfylt />
            </ContentWithTooltip>
        );
    }
    if (resultat === Vurderingsresultat.IKKE_OPPFYLT) {
        return (
            <ContentWithTooltip tooltipText="Innleggelsesperiode over ikke oppfylt periode">
                <InnleggelsesperiodeIkonOverIkkeOppfylt />
            </ContentWithTooltip>
        );
    }
    return (
        <ContentWithTooltip tooltipText="Innleggelsesperiode">
            <InstitutionIcon />
        </ContentWithTooltip>
    );
};

const renderResultatIcon = (resultat: Vurderingsresultat) => {
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

const renderStatusIndicator = (vurderingselement: Vurderingselement) => {
    const { erInnleggelsesperiode, resultat } = vurderingselement as ManuellVurdering;
    if (erInnleggelsesperiode) {
        return renderInnleggelsesperiodeIcon(resultat);
    }
    return renderResultatIcon(resultat);
};

const renderPersonIcon = ({ gjelderForAnnenPart, gjelderForSøker }: ManuellVurdering) => {
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

const VurderingsperiodeElement = ({
    vurderingselement,
    renderAfterElement,
    visParterLabel,
}: VurderingsperiodeElementProps): JSX.Element => {
    const { periode } = vurderingselement;
    return (
        <div className={styles.vurderingsperiodeElement}>
            <span className={styles.visuallyHidden}>Type</span>
            <div className={styles.vurderingsperiodeElement__indicator}>{renderStatusIndicator(vurderingselement)}</div>
            <div className={styles.vurderingsperiodeElement__texts}>
                <p className={styles.vurderingsperiodeElement__texts__period}>
                    <span className={styles.visuallyHidden}>Periode</span>
                    {prettifyPeriod(periode)}
                </p>
                {visParterLabel && (
                    <div className={styles.vurderingsperiodeElement__texts__parterIcon}>
                        <span className={styles.visuallyHidden}>Parter</span>
                        {renderPersonIcon(vurderingselement as ManuellVurdering)}
                    </div>
                )}
            </div>
            {renderAfterElement && renderAfterElement()}
        </div>
    );
};

export default VurderingsperiodeElement;
