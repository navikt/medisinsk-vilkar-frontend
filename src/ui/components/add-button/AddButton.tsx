import React from 'react';
import PlusIcon from '../icons/PlusIcon';
import styles from './addButton.less';

interface AddButtonProps {
    onClick: () => void;
    label: string;
}

const AddButton = ({ label, onClick }: AddButtonProps) => (
    <div className={styles.addButtonContainer}>
        <PlusIcon />
        <button className={styles.addButton} type="button" onClick={onClick}>
            {label}
        </button>
    </div>
);

export default AddButton;
