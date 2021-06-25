import React from 'react';
import { Period } from '@navikt/k9-period-utils';
import styles from './innleggelsesperiodeliste.less';

interface InnleggelsesperiodelisteProps {
    innleggelsesperioder: Period[];
}

const Innleggelsesperiodeliste = ({ innleggelsesperioder }: InnleggelsesperiodelisteProps): JSX.Element => (
    <ul className={styles.innleggelsesperiodeliste}>
        {innleggelsesperioder.map((innleggelsesperiode) => {
            const { fom, tom } = innleggelsesperiode;
            return (
                <li key={`${fom}${tom}`} className={styles.innleggelsesperiodeliste__element}>
                    {innleggelsesperiode.prettifyPeriod()}
                </li>
            );
        })}
    </ul>
);

export default Innleggelsesperiodeliste;
