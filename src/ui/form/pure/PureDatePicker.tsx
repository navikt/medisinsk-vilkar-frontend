import { Datepicker } from 'nav-datovelger';
import { DatepickerProps } from 'nav-datovelger/lib/Datepicker';
import { Label } from 'nav-frontend-skjema';
import * as React from 'react';
import Error from '../../components/error/Error';

interface CustomDatepickerProps {
    label: string;
    name: string;
    errorMessage?: string;
    ariaLabel?: string;
}

const PureDatepicker = ({
    label,
    value,
    onChange,
    name,
    errorMessage,
    limitations,
    ariaLabel,
}: DatepickerProps & CustomDatepickerProps): JSX.Element => (
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
        />
        {errorMessage && <Error message={errorMessage} />}
    </>
);

export default PureDatepicker;
