import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import PureDiagnosekodeSelector from '../pure/PureDiagnosekodeSelector';

interface DiagnosekodeSelektorProps {
    initialDiagnosekodeValue?: string;
    validators?: { [key: string]: (v: string) => string | boolean | undefined };
    name: string;
    label: string;
}

const DiagnosekodeSelektor = ({
    initialDiagnosekodeValue = '',
    validators,
    name,
    label,
}: DiagnosekodeSelektorProps): JSX.Element => {
    const { control, formState } = useFormContext();
    const { errors } = formState;
    return (
        <Controller
            control={control}
            name={name}
            defaultValue={initialDiagnosekodeValue}
            rules={{
                validate: {
                    ...validators,
                },
            }}
            render={({ field }) => {
                const { onChange } = field;
                return (
                    <PureDiagnosekodeSelector
                        label={label}
                        initialDiagnosekodeValue={initialDiagnosekodeValue}
                        name={name}
                        onChange={onChange}
                        errorMessage={errors[name]?.message}
                    />
                );
            }}
        />
    );
};

export default DiagnosekodeSelektor;
