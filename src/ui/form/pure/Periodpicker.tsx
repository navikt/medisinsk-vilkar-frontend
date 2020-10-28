import React from 'react';
import Datepicker, { DatepickerProps } from '../wrappers/Datepicker';

export interface PeriodpickerProps {
    fromDatepickerProps: DatepickerProps;
    toDatepickerProps: DatepickerProps;
}

export default ({ fromDatepickerProps, toDatepickerProps }: PeriodpickerProps) => (
    <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '1.5rem' }}>
            <Datepicker {...fromDatepickerProps} />
        </div>
        <div>
            <Datepicker {...toDatepickerProps} />
        </div>
    </div>
);
