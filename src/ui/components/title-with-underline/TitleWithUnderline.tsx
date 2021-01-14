import React from 'react';
import { Undertittel as TitleComponent } from 'nav-frontend-typografi';

interface TitleWithUnderlineProps {
    children: React.ReactNode;
}

const TitleWithUnderline = ({ children }: TitleWithUnderlineProps) => (
    <>
        <TitleComponent>{children}</TitleComponent>
        <hr style={{ color: '#B7B1A9' }} />
    </>
);

export default TitleWithUnderline;
