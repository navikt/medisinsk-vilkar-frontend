import * as React from 'react';
import { Element } from 'nav-frontend-typografi';
import { prettifyPeriod } from '../../../util/formats';
import { Period } from '../../../types/Period';
import styles from './periodList.less';

interface PeriodListProps {
    periods: Period[];
    title: string;
}

const PeriodList = ({ periods, title }: PeriodListProps): JSX.Element => (
    <>
        <p className={styles.title}>{title}</p>
        {periods.length > 0 ? (
            <ul className={styles.list}>
                {periods.map((period) => (
                    <li key={`${period.fom}-${period.tom}`}>
                        <Element>{prettifyPeriod(period)}</Element>
                    </li>
                ))}
            </ul>
        ) : (
            <p>Ingen perioder</p>
        )}
    </>
);

export default PeriodList;
