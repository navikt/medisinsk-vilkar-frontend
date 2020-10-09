import React from 'react';
import styles from './inputField.less';

interface InputFieldProps {
    id: string;
    label: string;
    readOnly?: boolean;
    placeholder?: string;
}

const InputField = ({ id, label, readOnly, placeholder }: InputFieldProps) => (
    <div>
        <label className={styles.label} htmlFor={id}>
            {label}
        </label>
        <input type="input" id={id} disabled={readOnly} placeholder={placeholder} />
    </div>
);

export default InputField;
