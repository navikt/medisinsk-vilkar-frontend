import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { RadioPanelGruppe as RadioPanelGroup } from 'nav-frontend-skjema';

interface RadioProps {
    value: string;
    label: string;
}

interface RadioGroupPanelProps {
    question: string;
    name: string;
    radios: RadioProps[];
    control: Control;
    errors?: FieldErrors;
    validators?: { [key: string]: (v: any) => string | undefined };
}

const RadioGroupPanel = ({
    errors,
    question,
    name,
    control,
    validators,
    radios,
}: RadioGroupPanelProps) => {
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
            render={({ onChange, value }) => (
                <RadioPanelGroup
                    legend={question}
                    name={name}
                    onChange={(event, newValue) => {
                        onChange(newValue);
                    }}
                    radios={radios}
                    checked={value}
                    feil={errors[name]?.message}
                />
            )}
        />
    );
};

export default RadioGroupPanel;
