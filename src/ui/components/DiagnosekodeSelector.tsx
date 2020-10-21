import * as React from 'react';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import PureDiagnosekodeSelector from '../form/pure/PureDiagnosekodeSelector';

interface DiagnosekodeSelektorProps {
    control: Control;
    initialDiagnosekodeValue?: string;
    validators?: { [key: string]: (v: any) => string | undefined };
    errors?: FieldErrors;
    name: string;
    label: string;
}

const DiagnosekodeSelektor = ({
    control,
    initialDiagnosekodeValue = '',
    validators,
    errors,
    name,
    label,
}: DiagnosekodeSelektorProps): JSX.Element => {
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
            render={({ onChange }) => (
                <PureDiagnosekodeSelector
                    label={label}
                    initialDiagnosekodeValue={initialDiagnosekodeValue}
                    name={name}
                    onChange={onChange}
                    errorMessage={errors[name]?.message}
                />
            )}
        />
    );
};

export default DiagnosekodeSelektor;
