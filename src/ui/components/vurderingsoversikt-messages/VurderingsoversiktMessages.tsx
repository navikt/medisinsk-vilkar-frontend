import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Box, { Margin } from '../box/Box';
import { getStringMedPerioder } from '../../../util/periodUtils';
import ManglerGyldigSignaturMelding from '../mangler-gyldig-signatur-melding/ManglerGyldigSignaturMelding';
import Vurderingstype from '../../../types/Vurderingstype';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';

interface VurderingsoversiktMessagesProps {
    vurderingsoversikt: Vurderingsoversikt;
    harGyldigSignatur: boolean;
    vurderingstype: Vurderingstype;
}

const VurderingsoversiktMessages = ({
    vurderingsoversikt,
    harGyldigSignatur,
    vurderingstype,
}: VurderingsoversiktMessagesProps) => {
    const vurderingsnavn =
        vurderingstype === Vurderingstype.TO_OMSORGSPERSONER ? 'to omsorgspersoner' : 'tilsyn og pleie';

    if (!harGyldigSignatur) {
        return (
            <ManglerGyldigSignaturMelding>
                Du kan ikke vurdere behov for
                {` ${vurderingsnavn} `}
                før søker har sendt inn legeerklæring fra sykehus/spesialisthelsetjenesten.
            </ManglerGyldigSignaturMelding>
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
            <Alertstripe type="advarsel">
                {`Vurder behov for ${vurderingsnavn} for ${getStringMedPerioder(
                    vurderingsoversikt.resterendeVurderingsperioder
                )}.`}
            </Alertstripe>
        );
        /*
            Please note:
            So long as this doesnt actually do anything upon the click-event, it should be commented out.
            overlappendeVurderingsperioder && overlappendeVurderingsperioder.length > 0 && (
            <Box marginTop={Margin.medium}>
                <OverlappendeSøknadsperiodePanel
                    onProgressButtonClick={() => console.log('does something')}
                    overlappendeVurderingsperioder={overlappendeVurderingsperioder}
                />
            </Box>)
        */
    }
    return null;
};

export default VurderingsoversiktMessages;
