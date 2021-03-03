import Lenke from 'nav-frontend-lenker';
import * as React from 'react';
import DocumentIcon from '../icons/DocumentIcon';
import styles from './dokumentKnapp.less';

interface DokumentKnappProps {
    href: string;
}

const DokumentKnapp = ({ href }: DokumentKnappProps) => (
    <Lenke href={href} target="_blank" className={styles.dokumentKnapp}>
        <DocumentIcon />
        Åpne dokument
    </Lenke>
);

export default DokumentKnapp;
