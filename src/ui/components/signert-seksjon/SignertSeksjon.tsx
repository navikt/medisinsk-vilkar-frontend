import React from 'react';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import GreenCheckIcon from '../icons/GreenCheckIcon';
import IconWithText from '../icon-with-text/IconWithText';
import WarningIcon from '../icons/WarningIcon';
import Box, { Margin } from '../box/Box';

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
                        text="Ingen legeerklæring fra spesialisthelsetjenesten registrert."
                    />
                )}
            </Box>
        </div>
    );
};

export default SignertSeksjon;
