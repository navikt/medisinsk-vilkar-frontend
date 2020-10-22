import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import PureDatepicker from '../pure/PureDatepicker';

export interface Limitations {
    minDate?: string;
    maxDate?: string;
}

interface DatepickerProps {
    label: string;
    name: string;
    control: Control;
    errors?: FieldErrors;
    validators?: { [key: string]: (v: any) => string | undefined };
    limitations?: Limitations;
    hiddenLabel?: boolean;
}

const Datepicker = ({
    errors,
    name,
    control,
    validators,
    limitations,
    label,
    hiddenLabel,
}: DatepickerProps): JSX.Element => {
    return (
        <Controller
            control={control}
            name={name}
            rules={{
                validate: {
                    ...validators,
                },
            }}
            render={({ onChange, value }) => (
                <PureDatepicker
                    label={label}
                    name={name}
                    onChange={onChange}
                    value={value}
                    errorMessage={errors[name]?.message}
                    limitations={limitations}
                    hiddenLabel={hiddenLabel}
                />
            )}
        />
    );
};

export default Datepicker;
