import * as React from 'react';
import { RadioPanelGruppe as RadioPanelGroup } from 'nav-frontend-skjema';

interface DatePickerProps {
    question: string;
    value: boolean;
    onChange: (value) => void;
    name: string;
    errorMessage?: string;
}

enum YesOrNo {
    YES = 'YES',
    NO = 'NO',
}

const resolveYesOrNoLiteral = (value: boolean | undefined) => {
    if (value === true) {
        return YesOrNo.YES;
    }
    if (value === false) {
        return YesOrNo.NO;
    }
    return undefined;
};

const PureDatePicker = ({ question, value, onChange, name, errorMessage }: DatePickerProps) => (
    <RadioPanelGroup
        legend={question}
        name={name}
        checked={resolveYesOrNoLiteral(value)}
        onChange={(event, value) => onChange(value === YesOrNo.YES)}
        radios={[
            { label: 'Ja', value: YesOrNo.YES },
            { label: 'Nei', value: YesOrNo.NO },
        ]}
        feil={errorMessage}
    />
);

export default PureDatePicker;
