import { Datepicker } from 'nav-datovelger';
import { DatepickerProps } from 'nav-datovelger/lib/Datepicker';
import { Label } from 'nav-frontend-skjema';
import * as React from 'react';
import { DayPickerProps } from 'react-day-picker';
import Error from '../../components/error/Error';

interface CustomDatepickerProps {
    label: string;
    name: string;
    errorMessage?: string;
    ariaLabel?: string;
    dayPickerProps?: DayPickerProps;
}

const PureDatepicker = ({
    label,
    value,
    onChange,
    name,
    errorMessage,
    limitations,
    ariaLabel,
    dayPickerProps,
}: DatepickerProps & CustomDatepickerProps): JSX.Element => {
    let customDayPickerProps;
    if (dayPickerProps) {
        customDayPickerProps = dayPickerProps;
    } else if (limitations.minDate) {
        customDayPickerProps = { initialMonth: new Date(limitations.minDate) };
    }
    return (
        <>
            {label && <Label htmlFor={name}>{label}</Label>}
            <Datepicker
                onChange={onChange}
                value={value}
                inputId={name}
                inputProps={{
                    placeholder: 'dd.mm.åååå',
                    'aria-label': ariaLabel,
                }}
                limitations={limitations}
                dayPickerProps={customDayPickerProps}
            />
            {errorMessage && <Error message={errorMessage} />}
        </>
    );
};

export default PureDatepicker;
