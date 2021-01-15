import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import styles from './innleggelsesperiodeliste.less';

interface InnleggelsesperiodelisteProps {
    innleggelsesperioder: Period[];
    onEditClick: (innleggelsesperiode: Period) => void;
    onDeleteClick: (innleggelsesperiode: Period) => void;
}

const Innleggelsesperiodeliste = ({
    innleggelsesperioder,
    onEditClick,
    onDeleteClick,
}: InnleggelsesperiodelisteProps) => {
    return (
        <ul className={styles.innleggelsesperiodeliste}>
            {innleggelsesperioder.map((innleggelsesperiode) => {
                const { fom, tom } = innleggelsesperiode;
                return (
                    <li key={`${fom}${tom}`} className={styles.innleggelsesperiodeliste__element}>
                        {prettifyPeriod(innleggelsesperiode)}
                        <div className={styles.lenkeContainer}>
                            <Lenke
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEditClick(innleggelsesperiode);
                                }}
                            >
                                Endre
                            </Lenke>
                            <Lenke
                                className={styles.lenkeContainer__slettLenke}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteClick(innleggelsesperiode);
                                }}
                            >
                                Slett
                            </Lenke>
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default Innleggelsesperiodeliste;
