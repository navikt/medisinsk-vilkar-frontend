import React from 'react';
import styles from './iconWithText.less';

interface IconWithTextProps {
    iconRenderer: () => React.ReactNode;
    text: string;
}

const IconWithText = ({ text, iconRenderer }: IconWithTextProps) => {
    return (
        <div className={styles.iconWithText}>
            {iconRenderer()}
            <span className={styles.iconWithText__text}>{text}</span>
        </div>
    );
};

export default IconWithText;
