import React from 'react';

interface RadioButtonProps {
    id: string;
    label: string;
    value: string;
    radioGroupName: string;
    readOnly?: boolean;
}

const RadioButton = ({ id, label, value, radioGroupName, readOnly }: RadioButtonProps) => (
    <div>
        <input type="radio" id={id} value={value} name={radioGroupName} disabled={readOnly} />
        <label htmlFor={id}>{label}</label>
    </div>
);

export default RadioButton;
