import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import moment from 'moment';
import { Periode } from '../../types/medisinsk-vilkår/MedisinskVilkår';
import styles from './periodevisning.less';

const getFormattedDate = (periode: Periode) => {
    const fomMoment = moment(periode.fom);
    const tomMoment = moment(periode.tom);
    const fomFormatted = fomMoment.format('DD.MM.YYYY');
    const tomFormatted = tomMoment.format('DD.MM.YYYY');

    return <Element tag="span">{`${fomFormatted} - ${tomFormatted}`}</Element>;
};

interface PeriodevisningProps {
    perioder: Periode[];
    title: string;
}

const Periodevisning = ({ perioder, title }: PeriodevisningProps): JSX.Element => (
    <>
        <p className={styles.title}>{title}</p>
        {perioder.length > 0 ? (
            <ul className={styles.list}>
                {perioder.map((periode) => (
                    <li>{getFormattedDate(periode)}</li>
                ))}
            </ul>
        ) : (
            <p>Ingen perioder</p>
        )}
    </>
);

export default Periodevisning;
