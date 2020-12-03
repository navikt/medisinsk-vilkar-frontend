import * as React from 'react';
import { Textarea } from 'nav-frontend-skjema';
import { Controller, useFormContext } from 'react-hook-form';
import ExpandableLabel from '../../components/expandable-label/ExpandableLabel';
import Box, { Margin } from '../../components/box/Box';

interface TextAreaProps {
    label?: React.ReactNode;
    name: string;
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
    helptext?: string;
}

const TextArea = ({ label, name, validators, helptext }: TextAreaProps): JSX.Element => {
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
            render={({ onChange, value }) => {
                if (helptext) {
                    return (
                        <>
                            <ExpandableLabel labelText={label} helptext={helptext} labelFor={name} />
                            <Box marginTop={Margin.medium}>
                                <Textarea
                                    value={value}
                                    maxLength={0}
                                    feil={errors[name]?.message}
                                    name={name}
                                    onChange={onChange}
                                    id={name}
                                />
                            </Box>
                        </>
                    );
                }
                return (
                    <Textarea
                        value={value}
                        label={label}
                        maxLength={0}
                        feil={errors[name]?.message}
                        name={name}
                        onChange={onChange}
                    />
                );
            }}
        />
    );
};

export default TextArea;
