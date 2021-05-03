import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';
import ManuellVurdering from '../../../types/ManuellVurdering';
import Vurdering from '../../../types/Vurdering';
import Vurderingselement from '../../../types/Vurderingselement';
import Vurderingstype from '../../../types/Vurderingstype';
import { findHrefByRel } from '../../../util/linkUtils';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';
import VurderingsoppsummeringForInnleggelsesperiode from '../vurderingsoppsummering-for-innleggelsesperiode/VurderingsoppsummeringForInnleggelsesperiode';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';

interface VurderingsdetaljerControllerProps {
    vurderingselement: Vurderingselement;
    vurderingstype: Vurderingstype;
    redigerVurdering?: () => void;
    vurderingsdetaljerRenderer?: (valgtVurdering: Vurdering) => JSX.Element;
}

const Vurderingsoppsummering = ({
    vurdering,
    redigerVurdering,
}: {
    vurdering: Vurdering;
    redigerVurdering: () => void;
}) => {
    if (vurdering.type === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return (
            <VurderingsoppsummeringForKontinuerligTilsynOgPleie
                vurdering={vurdering}
                redigerVurdering={redigerVurdering}
            />
        );
    }
    if (vurdering.type === Vurderingstype.TO_OMSORGSPERSONER) {
        return <VurderingsoppsummeringForToOmsorgspersoner vurdering={vurdering} />;
    }
    return null;
};

const VurderingsdetaljerController = ({
    vurderingselement,
    vurderingstype,
    redigerVurdering,
    vurderingsdetaljerRenderer,
}: VurderingsdetaljerControllerProps) => {
    const manuellVurdering = vurderingselement as ManuellVurdering;
    const innleggelsesperiodeVurdering = vurderingselement as InnleggelsesperiodeVurdering;

    const needsToFetchMoreDetails = manuellVurdering.resultat !== undefined;
    if (needsToFetchMoreDetails) {
        const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);
        return (
            <VurderingsdetaljerFetcher
                url={url}
                contentRenderer={(valgtVurdering) => vurderingsdetaljerRenderer(valgtVurdering)}
                // return <Vurderingsoppsummering vurdering={valgtVurdering} redigerVurdering={redigerVurdering} />;
            />
        );
    }

    return (
        <VurderingsoppsummeringForInnleggelsesperiode
            vurdering={innleggelsesperiodeVurdering}
            vurderingstype={vurderingstype}
            redigerVurdering={redigerVurdering}
        />
    );
};

export default VurderingsdetaljerController;
