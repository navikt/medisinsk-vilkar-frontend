import React from 'react';
import { Vurderingselement } from '../../../types/Vurderingselement';
import ManuellVurdering from '../../../types/ManuellVurdering';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import VurderingsdetaljerFetcher from '../vurderingsdetaljer-fetcher/VurderingsdetaljerFetcher';
import { findHrefByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import { InnleggelsesperiodeVurdering } from '../../../types/InnleggelsesperiodeVurdering';
import VurderingsoppsummeringForInnleggelsesperiode from '../vurderingsoppsummering-for-innleggelsesperiode/VurderingsoppsummeringForInnleggelsesperiode';
import Vurderingstype from '../../../types/Vurderingstype';
import Vurdering from '../../../types/Vurdering';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';

interface VurderingsdetaljerControllerProps {
    vurderingselement: Vurderingselement;
    vurderingstype: Vurderingstype;
}

const Vurderingsoppsummering = ({ vurdering }: { vurdering: Vurdering }) => {
    if (vurdering.type === Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE) {
        return <VurderingsoppsummeringForKontinuerligTilsynOgPleie vurdering={vurdering} />;
    }
    if (vurdering.type === Vurderingstype.TO_OMSORGSPERSONER) {
        return <VurderingsoppsummeringForToOmsorgspersoner vurdering={vurdering} />;
    }
    return null;
};

const VurderingsdetaljerController = ({ vurderingselement, vurderingstype }: VurderingsdetaljerControllerProps) => {
    const manuellVurdering = vurderingselement as ManuellVurdering;
    const innleggelsesperiodeVurdering = vurderingselement as InnleggelsesperiodeVurdering;

    const needsToFetchMoreDetails = manuellVurdering.resultat !== undefined;
    if (needsToFetchMoreDetails) {
        const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);
        return (
            <VurderingsdetaljerFetcher
                url={url}
                contentRenderer={(valgtVurdering) => <Vurderingsoppsummering vurdering={valgtVurdering} />}
            />
        );
    }

    return (
        <VurderingsoppsummeringForInnleggelsesperiode
            vurdering={innleggelsesperiodeVurdering}
            vurderingstype={vurderingstype}
        />
    );
};

export default VurderingsdetaljerController;
