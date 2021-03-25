import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';

const DekketAvInnleggelsesperiodeMelding = () => {
    return (
        <Alertstripe type="info">
            Hele eller deler av den vurderte perioden er dekket av innleggelsesperioder. Vurderingen blir dermed ikke
            brukt for de dagene det gjelder.
        </Alertstripe>
    );
};

export default DekketAvInnleggelsesperiodeMelding;
