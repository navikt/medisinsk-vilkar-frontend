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

interface VurderingsdetaljerControllerProps {
    vurderingselement: Vurderingselement;
    vurderingstype: Vurderingstype;
    contentRenderer?: (valgtVurdering: Vurdering) => JSX.Element;
}

const VurderingsdetaljerController = ({
    vurderingselement,
    vurderingstype,
    contentRenderer,
}: VurderingsdetaljerControllerProps) => {
    const manuellVurdering = vurderingselement as ManuellVurdering;
    const innleggelsesperiodeVurdering = vurderingselement as InnleggelsesperiodeVurdering;

    const needsToFetchMoreDetails = manuellVurdering.resultat !== undefined;
    if (needsToFetchMoreDetails) {
        const url = findHrefByRel(LinkRel.HENT_VURDERING, manuellVurdering.links);
        return (
            <VurderingsdetaljerFetcher
                url={url}
                contentRenderer={(valgtVurdering) => contentRenderer(valgtVurdering)}
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
