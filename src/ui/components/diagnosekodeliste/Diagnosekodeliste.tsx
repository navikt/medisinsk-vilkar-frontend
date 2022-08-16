import Lenke from 'nav-frontend-lenker';
import React from 'react';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './diagnosekodeliste.less';

interface DiagnosekodelisteProps {
    diagnosekoder: string[];
    onDeleteClick: (diagnosekode: string) => void;
}

const Diagnosekodeliste = ({ diagnosekoder, onDeleteClick }: DiagnosekodelisteProps): JSX.Element => (
    <ul className={styles.diagnosekodeliste}>
        {diagnosekoder.map((diagnosekode) => (
            <li key={`${diagnosekode}`} className={styles.diagnosekodeliste__element}>
                <p className={styles.beskrivelse}>{diagnosekode}</p>
                <WriteAccessBoundContent
                    contentRenderer={() => (
                        <div className={styles.lenkeContainer}>
                            <Lenke
                                className={styles.lenkeContainer__slettLenke}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteClick(diagnosekode);
                                }}
                            >
                                Slett
                            </Lenke>
                        </div>
                    )}
                />
            </li>
        ))}
    </ul>
);

export default Diagnosekodeliste;
