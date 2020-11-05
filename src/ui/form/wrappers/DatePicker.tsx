import { DatepickerLimitations } from 'nav-datovelger';
import React from 'react';
import { DayPickerProps } from 'react-day-picker';
import { Controller, useFormContext } from 'react-hook-form';
import PureDatepicker from '../pure/PureDatepicker';

export interface DatepickerProps {
    label?: string;
    name: string;
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
    ariaLabel?: string;
    defaultValue?: string;
    limitations: DatepickerLimitations;
    error?: string;
    dayPickerProps?: DayPickerProps;
}

const Datepicker = ({
    name,
    validators,
    limitations,
    label,
    ariaLabel,
    defaultValue,
    error,
    dayPickerProps,
}: DatepickerProps): JSX.Element => {
    const { control, errors } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            rules={{
                validate: {
                    ...validators,
                },
            }}
            defaultValue={defaultValue}
            render={({ onChange, value }) => (
                <PureDatepicker
                    label={label}
                    name={name}
                    onChange={onChange}
                    value={value}
                    errorMessage={error || errors[name]?.message}
                    limitations={limitations}
                    ariaLabel={ariaLabel}
                    dayPickerProps={dayPickerProps}
                />
            )}
        />
    );
};

export default Datepicker;
