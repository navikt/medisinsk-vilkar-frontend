import { Datepicker } from 'nav-datovelger';
import { Label } from 'nav-frontend-skjema';
import * as React from 'react';
import Error from '../../components/Error';
import { Limitations } from '../wrappers/DatePicker';

interface DatepickerProps {
    label: string;
    value: string;
    onChange: (value) => void;
    name: string;
    errorMessage?: string;
    limitations: Limitations;
}

const PureDatepicker = ({
    label,
    value,
    onChange,
    name,
    errorMessage,
    limitations,
}: DatepickerProps): JSX.Element => (
    <>
        <Label htmlFor={name}>{label}</Label>
        <Datepicker
            onChange={onChange}
            value={value}
            inputId={name}
            inputProps={{
                placeholder: 'dd.mm.åååå',
            }}
            limitations={{
                minDate: limitations?.minDate,
                maxDate: limitations?.maxDate,
            }}
        />
        {errorMessage && <Error message={errorMessage} />}
    </>
);

export default PureDatepicker;
