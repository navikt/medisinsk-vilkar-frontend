import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { getHumanReadablePeriodString } from '@navikt/k9-period-utils';
import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';
import ManglerGyldigSignaturMelding from '../mangler-gyldig-signatur-melding/ManglerGyldigSignaturMelding';

interface VurderingsoversiktSluttfaseMessagesProps {
    vurderingsoversikt: Vurderingsoversikt;
    harGyldigSignatur: boolean;
}

const VurderingsoversiktSluttfaseMessages = ({
    vurderingsoversikt,
    harGyldigSignatur,
}: VurderingsoversiktSluttfaseMessagesProps): JSX.Element => {
    if (!harGyldigSignatur) {
        return (
            <Box marginBottom={Margin.large}>
                <ManglerGyldigSignaturMelding>
                    Du kan ikke vurdere behov for om pleietrengende er i livets sluttfase før søker har sendt inn
                    legeerklæring fra lege eller helseinstitusjon.
                </ManglerGyldigSignaturMelding>
            </Box>
        );
    }

    if (vurderingsoversikt.harIngenPerioderÅVise()) {
        return (
            <Box marginBottom={Margin.large}>
                <IngenPerioderÅVurdereMelding />
            </Box>
        );
    }

    if (vurderingsoversikt.harPerioderSomSkalVurderes() === true) {
        return (
            <>
                <Box marginBottom={Margin.large}>
                    <Alertstripe type="advarsel">
                        {`Vurder om pleietrengende er i livets sluttfase i søknadsperioden ${getHumanReadablePeriodString(
                            vurderingsoversikt.resterendeVurderingsperioder
                        )}.`}
                    </Alertstripe>
                </Box>
            </>
        );
    }
    return null;
};

export default VurderingsoversiktSluttfaseMessages;
