import React from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import { Period } from '../../../types/Period';
import ContainerContext from '../../context/ContainerContext';
import Vurderingstype from '../../../types/Vurderingstype';
import VurderingAvTilsynsbehovForm, { FieldName } from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';

interface VurderingsdetaljvisningForNyVurderingProps {
    vurderingsoversikt: Vurderingsoversikt;
    radForNyVurderingErSynlig: boolean;
    onVurderingLagret: () => void;
    onAvbryt: () => void;
}

const VurderingsdetaljvisningForNyVurdering = ({
    vurderingsoversikt,
    onVurderingLagret,
    onAvbryt,
    radForNyVurderingErSynlig,
}: VurderingsdetaljvisningForNyVurderingProps) => {
    const opprettLink = findLinkByRel(LinkRel.OPPRETT_VURDERING, vurderingsoversikt.links);
    const resterendeVurderingsperioderDefaultValue = vurderingsoversikt.resterendeVurderingsperioder;
    const defaultPerioder =
        resterendeVurderingsperioderDefaultValue.length > 0
            ? resterendeVurderingsperioderDefaultValue
            : [new Period('', '')];
    const { endpoints } = React.useContext(ContainerContext);

    return (
        <NyVurderingController
            vurderingstype={Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE}
            opprettVurderingLink={opprettLink}
            dataTilVurderingUrl={endpoints.dataTilVurdering}
            onVurderingLagret={onVurderingLagret}
            formRenderer={(dokumenter, onSubmit) => (
                <VurderingAvTilsynsbehovForm
                    defaultValues={{
                        [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                        [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                        [FieldName.PERIODER]: defaultPerioder,
                        [FieldName.DOKUMENTER]: [],
                    }}
                    resterendeVurderingsperioder={resterendeVurderingsperioderDefaultValue}
                    perioderSomKanVurderes={vurderingsoversikt.perioderSomKanVurderes}
                    dokumenter={dokumenter}
                    onSubmit={onSubmit}
                    onAvbryt={radForNyVurderingErSynlig ? () => onAvbryt() : undefined}
                />
            )}
        />
    );
};

export default VurderingsdetaljvisningForNyVurdering;
