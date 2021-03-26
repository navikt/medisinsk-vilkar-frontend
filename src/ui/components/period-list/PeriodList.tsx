import * as React from 'react';
import classnames from 'classnames';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import CalendarIcon from '../icons/CalendarIcon';
import styles from './periodList.less';

interface PeriodListProps {
    periods: Period[];
    className?: string;
}

const PeriodList = ({ periods, className }: PeriodListProps): JSX.Element => {
    const cls = classnames(styles.periodList, {
        [className]: !!className,
    });
    return (
        <div className={cls}>
            <div className={styles.periodList__calendarIcon}>
                <CalendarIcon />
            </div>
            <span className={styles.periodList__periods}>
                {periods.map((period) => prettifyPeriod(period)).join(', ')}
            </span>
        </div>
    );
};
export default PeriodList;
