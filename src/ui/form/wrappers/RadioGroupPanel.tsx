import { RadioPanelGruppe as RadioPanelGroup } from 'nav-frontend-skjema';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface RadioProps {
    value: string;
    label: string;
}

interface RadioGroupPanelProps {
    question: string;
    name: string;
    radios: RadioProps[];
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
}

const RadioGroupPanel = ({ question, name, validators, radios }: RadioGroupPanelProps) => {
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
