import { Box, Margin, TitleWithUnderline } from '@navikt/k9-react-components';
import React from 'react';
import GreenCheckIcon from '../icons/GreenCheckIcon';
import IconWithText from '../icon-with-text/IconWithText';
import WarningIcon from '../icons/WarningIcon';

interface SignertSeksjonProps {
    harGyldigSignatur: boolean;
}

const SignertSeksjon = ({ harGyldigSignatur }: SignertSeksjonProps) => {
    return (
        <div>
            <TitleWithUnderline>Godkjent signatur</TitleWithUnderline>
            <Box marginTop={Margin.medium}>
                {harGyldigSignatur && (
                    <IconWithText
                        iconRenderer={() => <GreenCheckIcon />}
                        text="Det finnes dokumentasjon som er signert av sykehuslege eller lege fra spesialisthelsetjenesten."
                    />
                )}
                {!harGyldigSignatur && (
                    <IconWithText
                        iconRenderer={() => <WarningIcon />}
                        text="Ingen legeerklæring fra sykehuslege/spesialisthelsetjenesten registrert."
                    />
                )}
            </Box>
        </div>
    );
};

export default SignertSeksjon;
