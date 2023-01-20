import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import { getHumanReadablePeriodString } from '@navikt/k9-period-utils';
import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import IngenPerioderÅVurdereMelding from '../ingen-perioder-å-vurdere-melding/IngenPerioderÅVurdereMelding';

interface VurderingsoversiktLangvarigSykdomMessagesProps {
    vurderingsoversikt: Vurderingsoversikt;
}

const VurderingsoversiktLangvarigSykdomMessages = ({
    vurderingsoversikt,
}: VurderingsoversiktLangvarigSykdomMessagesProps): JSX.Element => {
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
                        {`Vurder om pleietrengende har langvarig sykdom i søknadsperioden ${getHumanReadablePeriodString(
                            vurderingsoversikt.resterendeVurderingsperioder
                        )}.`}
                    </Alertstripe>
                </Box>
            </>
        );
    }
    return null;
};

export default VurderingsoversiktLangvarigSykdomMessages;
