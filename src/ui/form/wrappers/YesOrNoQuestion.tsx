import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import PureYesOrNoQuestion from '../pure/PureYesOrNoQuestion';

interface YesOrNoQuestionProps {
    question: string;
    name: string;
    control: Control;
    errors?: FieldErrors;
    validators?: { [key: string]: (v: any) => string | undefined };
}

const YesOrNoQuestion = ({ errors, question, name, control, validators }: YesOrNoQuestionProps) => {
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
                <PureYesOrNoQuestion
                    question={question}
                    name={name}
                    onChange={onChange}
                    value={value}
                    errorMessage={errors[name]?.message}
                />
            )}
        />
    );
};

export default YesOrNoQuestion;
