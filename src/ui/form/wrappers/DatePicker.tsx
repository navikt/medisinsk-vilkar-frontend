import { DatepickerLimitations } from 'nav-datovelger';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PureDatepicker from '../pure/PureDatepicker';

export interface DatepickerProps {
    label?: string;
    name: string;
    validators?: { [key: string]: (v: any) => string | undefined };
    ariaLabel?: string;
    defaultValue?: string;
    limitations: DatepickerLimitations;
}

const Datepicker = ({
    name,
    validators,
    limitations,
    label,
    ariaLabel,
    defaultValue,
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
                    errorMessage={errors[name]?.message}
                    limitations={limitations}
                    ariaLabel={ariaLabel}
                />
            )}
        />
    );
};

export default Datepicker;
