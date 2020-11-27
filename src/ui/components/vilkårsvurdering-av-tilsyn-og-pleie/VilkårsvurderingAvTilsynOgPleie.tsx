import React from 'react';
import Vilkårsvurdering from '../vilkårsvurdering/Vilkårsvurdering';
import { hentTilsynsbehovVurderinger } from '../../../util/httpMock';
import VurderingsdetaljerForKontinuerligTilsynOgPleie from '../vurderingsdetaljer-for-kontinuerlig-tilsyn-og-pleie/VurderingsdetaljerForKontinuerligTilsynOgPleie';

const VilkårsvurderingAvTilsynOgPleie = () => {
    return (
        <Vilkårsvurdering
            hentVurderinger={hentTilsynsbehovVurderinger}
            vurderingsdetaljerRenderer={(valgtVurdering) => (
                <VurderingsdetaljerForKontinuerligTilsynOgPleie vurdering={valgtVurdering} />
            )}
        />
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
