import Lenke from 'nav-frontend-lenker';
import * as React from 'react';
import ArrowIcon from '../icons/ArrowIcon';
import styles from './dokumentKnapp.less';

const DokumentKnapp = ({ href }) => (
    <Lenke href={href} target="_blank" className={styles.dokumentKnapp}>
        Åpne dokument
        <ArrowIcon />
    </Lenke>
);

export default DokumentKnapp;
