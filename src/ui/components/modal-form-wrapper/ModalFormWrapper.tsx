import { Heading } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import React from 'react';

interface ModalFormWrapperProps {
    title: string;
    children: React.ReactNode;
}

const ModalFormWrapper = ({ title, children }: ModalFormWrapperProps): JSX.Element => (
    <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Heading size="small" level="2">
            {title}
        </Heading>
        <Box marginTop={Margin.large}>{children}</Box>
    </div>
);

export default ModalFormWrapper;
