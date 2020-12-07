import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Checkbox, CheckboxGruppe, CheckboxProps } from 'nav-frontend-skjema';

interface CheckboxGroupProps {
    question: string;
    name: string;
    checkboxes: CheckboxProps[];
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
}

const CheckboxGroup = ({ question, checkboxes, name, validators }: CheckboxGroupProps) => {
    const { control, errors } = useFormContext();
    return (
        <Controller
            control={control}
            defaultValue={null}
            name={name}
            rules={{
                validate: {
                    ...validators,
                },
            }}
            render={({ name, onChange }) => {
                return (
                    <CheckboxGruppe legend={question} feil={errors[name]?.message}>
                        {checkboxes.map((checkboxProps) => (
                            <Checkbox
                                {...checkboxProps}
                                onChange={() => onChange(checkboxProps.value)}
                                key={'' + checkboxProps.value}
                            />
                        ))}
                    </CheckboxGruppe>
                );
            }}
        />
    );
};

export default CheckboxGroup;
