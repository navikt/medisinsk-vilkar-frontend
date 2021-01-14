import React from 'react';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import Box, { Margin } from '../box/Box';
import AddButton from '../add-button/AddButton';

const Innleggelsesperiodeoversikt = () => {
    return (
        <div className="innleggelsesperiodeoversikt">
            <TitleWithUnderline>Test</TitleWithUnderline>

            <Box marginTop={Margin.large}>
                <p>Ingen innleggelsesperioder registrert</p>
            </Box>
            <Box marginTop={Margin.large}>
                <AddButton label="Legg til innleggelsesperiode" onClick={() => console.log('hey')} />
            </Box>
        </div>
    );
};

export default Innleggelsesperiodeoversikt;
