import * as React from 'react';
import { Textarea } from 'nav-frontend-skjema';
import { Controller, useFormContext } from 'react-hook-form';

interface TextAreaProps {
    label?: React.ReactNode;
    name: string;
    validators?: { [key: string]: (v: any) => string | undefined };
}

const TextArea = ({ label, name, validators }: TextAreaProps): JSX.Element => {
    const { control, errors } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={null}
            rules={{
                validate: {
                    ...validators,
                },
            }}
            render={({ onChange, value }) => (
                <Textarea
                    value={value}
                    label={label}
                    maxLength={0}
                    feil={errors[name]?.message}
                    name={name}
                    onChange={onChange}
                />
            )}
        />
    );
};

export default TextArea;
