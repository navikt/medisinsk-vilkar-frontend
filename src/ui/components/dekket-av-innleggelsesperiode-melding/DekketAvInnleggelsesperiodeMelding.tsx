import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';

const DekketAvInnleggelsesperiodeMelding = () => {
    return (
        <Alertstripe type="info">
            Hele eller deler av perioden er oppfylt som følge av innleggelse. Vurderingen som ligger til grunn blir
            dermed ikke brukt for disse dagene.
        </Alertstripe>
    );
};

export default DekketAvInnleggelsesperiodeMelding;
