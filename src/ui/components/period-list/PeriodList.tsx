import * as React from 'react';
import { Element } from 'nav-frontend-typografi';
import { prettifyPeriod } from '../../../util/formats';
import { Period } from '../../../types/Period';
import { isValidPeriod } from '../../../util/dateUtils';
import styles from './periodList.less';

interface PeriodListProps {
    periods: Period[];
    title: string;
}

const PeriodList = ({ periods, title }: PeriodListProps): JSX.Element => {
    const periodsToShow = periods.filter(isValidPeriod);
    return (
        <>
            <p className={styles.title}>{title}</p>
            {periodsToShow.length > 0 ? (
                <ul className={styles.list}>
                    {periodsToShow.map((period) => (
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
};
export default PeriodList;
