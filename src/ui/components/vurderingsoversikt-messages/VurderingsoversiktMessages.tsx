import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurderingstype from '../../../types/Vurderingstype';
import { addYearsToDate } from '../../../util/dateUtils';
import { getStringMedPerioder } from '../../../util/periodUtils';
import Box, { Margin } from '../box/Box';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';
import ManglerGyldigSignaturMelding from '../mangler-gyldig-signatur-melding/ManglerGyldigSignaturMelding';

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
            <Box marginBottom={Margin.large}>
                <ManglerGyldigSignaturMelding>
                    Du kan ikke vurdere behov for
                    {` ${vurderingsnavn} `}
                    før søker har sendt inn legeerklæring fra sykehus/spesialisthelsetjenesten.
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
        const barnetsAttenårsdag = vurderingsoversikt.harPerioderDerPleietrengendeErOver18år
            ? addYearsToDate(vurderingsoversikt.pleietrengendesFødselsdato, 18)
            : null;

        return (
            <>
                <Box marginBottom={Margin.large}>
                    <Alertstripe type="advarsel">
                        {`Vurder behov for ${vurderingsnavn} for ${getStringMedPerioder(
                            vurderingsoversikt.finnResterendeVurderingsperioder()
                        )}.`}
                    </Alertstripe>
                </Box>
                {vurderingsoversikt.harPerioderDerPleietrengendeErOver18år && (
                    <Box marginBottom={Margin.large}>
                        <Alertstripe type="advarsel">
                            Barnet er 18 år {barnetsAttenårsdag}. Du må gjøre en egen vurdering etter § 9-10, tredje
                            ledd fra datoen barnet fyller 18 år.
                        </Alertstripe>
                    </Box>
                )}
            </>
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
