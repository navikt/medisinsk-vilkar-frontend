import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import InnleggelsesperiodeVurdering from '../../../types/InnleggelsesperiodeVurdering';
import { prettifyPeriod } from '../../../util/formats';
import Box, { Margin } from '../box/Box';
import Vurderingstype from '../../../types/Vurderingstype';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForInnleggelsesperiodeProps {
    vurdering: InnleggelsesperiodeVurdering;
    vurderingstype: Vurderingstype;
}

const VurderingsoppsummeringForInnleggelsesperiode = ({
    vurdering,
    vurderingstype,
}: VurderingsoppsummeringForInnleggelsesperiodeProps) => {
    const vurderingstekst =
        vurderingstype === Vurderingstype.TO_OMSORGSPERSONER ? 'to omsorgspersoner' : 'kontinuerlig tilsyn og pleie';
    return (
        <DetailViewVurdering
            title={`Vurdering av behov for ${vurderingstekst}`}
            contentAfterTitleRenderer={() => prettifyPeriod(vurdering.periode)}
        >
            <Box marginTop={Margin.medium}>
                <Alertstripe type="info">Innvilget som følge av innleggelse</Alertstripe>
            </Box>
        </DetailViewVurdering>
    );
};

export default VurderingsoppsummeringForInnleggelsesperiode;
