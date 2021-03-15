import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import { Period } from '../../../types/Period';
import { getStringMedPerioder } from '../../../util/periodUtils';

interface VurderBehovForPerioderMeldingProps {
    vurderingsnavn: string;
    perioder: Period[];
}

const VurderBehovForPerioderMelding = ({ vurderingsnavn, perioder }: VurderBehovForPerioderMeldingProps) => {
    return (
        <Alertstripe type="advarsel">
            Vurder behov for
            {vurderingsnavn}
            for ${getStringMedPerioder(perioder)}
        </Alertstripe>
    );
};

export default VurderBehovForPerioderMelding;
