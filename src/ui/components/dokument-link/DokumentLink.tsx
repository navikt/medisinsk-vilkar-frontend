import React from 'react';
import Lenke from 'nav-frontend-lenker';
import Dokument from '../../../types/Dokument';
import { prettifyDate } from '../../../util/formats';

interface DokumentLinkProps {
    dokument: Dokument;
}

const DokumentLink = ({ dokument }: DokumentLinkProps) => {
    const { type, datert, location } = dokument;
    return (
        <Lenke
            href={location}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            {type} ({prettifyDate(datert.toDateString())})
        </Lenke>
    );
};

export default DokumentLink;
