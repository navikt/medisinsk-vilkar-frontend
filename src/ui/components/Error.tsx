import * as React from 'react';
import styles from './error.less';

interface ErrorProps {
    message?: string;
}

const Error = ({ message }: ErrorProps): JSX.Element => (
    <p className={styles.error}>{message || 'Dette er et påkrevd felt'}</p>
);

export default Error;
