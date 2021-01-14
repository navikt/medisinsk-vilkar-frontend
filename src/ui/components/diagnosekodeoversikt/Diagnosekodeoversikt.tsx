import React from 'react';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import Box, { Margin } from '../box/Box';
import AddButton from '../add-button/AddButton';

const Diagnosekodeoversikt = () => {
    return (
        <div className="diagnosekodeoversikt">
            <TitleWithUnderline>Test</TitleWithUnderline>
            <Box marginTop={Margin.large}>
                <p>Ingen diagnosekoder registrert</p>
            </Box>
            <Box marginTop={Margin.large}>
                <AddButton label="Legg til diagnosekode" onClick={() => console.log('hey')} />
            </Box>
        </div>
    );
};

export default Diagnosekodeoversikt;
