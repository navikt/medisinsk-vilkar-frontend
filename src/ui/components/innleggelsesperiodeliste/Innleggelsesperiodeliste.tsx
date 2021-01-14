import React from 'react';
import { Period } from '../../../types/Period';
import { prettifyDate } from '../../../util/formats';

interface InnleggelsesperiodelisteProps {
    innleggelsesperioder: Period[];
}

const Innleggelsesperiodeliste = ({ innleggelsesperioder }: InnleggelsesperiodelisteProps) => {
    return (
        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
            {innleggelsesperioder.map(({ fom, tom }) => (
                <li key={`${fom}${tom}`}>{`${prettifyDate(fom)} - ${prettifyDate(tom)}`}</li>
            ))}
        </ul>
    );
};

export default Innleggelsesperiodeliste;
