import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';
import Box, { Margin } from '../box/Box';
import Vurderingstype from '../../../types/Vurderingstype';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForInnleggelsesperiodeProps {
    vurdering: InnleggelsesperiodeVurdering;
    vurderingstype: Vurderingstype;
    redigerVurdering: () => void;
}

const VurderingsoppsummeringForInnleggelsesperiode = ({
    vurdering,
    vurderingstype,
    redigerVurdering,
}: VurderingsoppsummeringForInnleggelsesperiodeProps) => {
    const vurderingstekst =
        vurderingstype === Vurderingstype.TO_OMSORGSPERSONER ? 'to omsorgspersoner' : 'tilsyn og pleie';
    return (
        <DetailViewVurdering
            title={`Vurdering av ${vurderingstekst}`}
            perioder={[vurdering.periode]}
            redigerVurdering={redigerVurdering}
        >
            <Box marginTop={Margin.large}>
                <Alertstripe type="info">Innvilget som følge av innleggelse</Alertstripe>
            </Box>
        </DetailViewVurdering>
    );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
