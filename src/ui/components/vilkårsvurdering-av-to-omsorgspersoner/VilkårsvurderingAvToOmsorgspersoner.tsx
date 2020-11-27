import React from 'react';
import Vilkårsvurdering from '../vilkårsvurdering/Vilkårsvurdering';
import { hentToOmsorgspersonerVurderinger } from '../../../util/httpMock';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';

const VilkårsvurderingAvToOmsorgspersoner = () => {
    return (
        <Vilkårsvurdering
            hentVurderinger={hentToOmsorgspersonerVurderinger}
            vurderingsdetaljerRenderer={(valgtVurdering) => (
                <VurderingsdetaljerForToOmsorgspersoner vurdering={valgtVurdering} />
            )}
        />
    );
};

export default VilkårsvurderingAvToOmsorgspersoner;
