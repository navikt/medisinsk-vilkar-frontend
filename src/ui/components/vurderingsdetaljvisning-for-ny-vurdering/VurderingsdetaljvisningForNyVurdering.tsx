import React from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import { Period } from '../../../types/Period';
import ContainerContext from '../../context/ContainerContext';
import Vurderingstype from '../../../types/Vurderingstype';
import VurderingAvTilsynsbehovForm, {
    FieldName as KTPFieldName,
} from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import VurderingAvToOmsorgspersonerForm, {
    FieldName as TOFieldName,
} from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import NyVurderingController from '../ny-vurdering-controller/NyVurderingController';
import VurderingContext from '../../context/VurderingContext';

interface VurderingsdetaljvisningForNyVurderingProps {
    vurderingsoversikt: Vurderingsoversikt;
    radForNyVurderingErSynlig: boolean;
    onVurderingLagret: () => void;
    onAvbryt: () => void;
}

function makeDefaultValues(vurderingstype: Vurderingstype, perioder: Period[]) {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return {
            [KTPFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
            [KTPFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
            [KTPFieldName.PERIODER]: perioder,
            [KTPFieldName.DOKUMENTER]: [],
        };
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return {
            [TOFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
            [TOFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
            [TOFieldName.PERIODER]: perioder,
            [TOFieldName.DOKUMENTER]: [],
        };
    }
    return {};
}

function getFormComponent(vurderingstype: Vurderingstype) {
    if (vurderingstype === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return VurderingAvTilsynsbehovForm;
    }
    if (vurderingstype === Vurderingstype.TO_OMSORGSPERSONER) {
        return VurderingAvToOmsorgspersonerForm;
    }
    return null;
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
    const { vurderingstype } = React.useContext(VurderingContext);
    const FormComponent = getFormComponent(vurderingstype);

    return (
        <NyVurderingController
            opprettVurderingLink={opprettLink}
            dataTilVurderingUrl={endpoints.dataTilVurdering}
            onVurderingLagret={onVurderingLagret}
            formRenderer={(dokumenter, onSubmit) => (
                <FormComponent
                    defaultValues={makeDefaultValues(vurderingstype, defaultPerioder) as any}
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
