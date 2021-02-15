import React from 'react';
import PlusIcon from '../icons/PlusIcon';
import styles from './addButton.less';

interface AddButtonProps {
    onClick: () => void;
    label: string;
}

const AddButton = ({ label, onClick }: AddButtonProps) => (
    <button className={styles.addButton} type="button" onClick={onClick}>
        <PlusIcon />
        <span className={styles.addButton__text}>{label}</span>
    </button>
);

export default AddButton;
