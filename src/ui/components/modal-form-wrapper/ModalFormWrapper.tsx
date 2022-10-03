import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';

interface ModalFormWrapperProps {
    title: string;
    children: React.ReactNode;
}

const ModalFormWrapper = ({ title, children }: ModalFormWrapperProps): JSX.Element => (
    <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Undertittel>{title}</Undertittel>
        <Box marginTop={Margin.large}>{children}</Box>
    </div>
);

export default ModalFormWrapper;
