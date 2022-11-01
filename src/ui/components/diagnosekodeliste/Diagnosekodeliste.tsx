import React from 'react';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './diagnosekodeliste.css';

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
                            <button
                                type="button"
                                className={`${styles.lenkeContainer__slettLenke} navds-link`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteClick(diagnosekode);
                                }}
                            >
                                Slett
                            </button>
                        </div>
                    )}
                />
            </li>
        ))}
    </ul>
);

export default Diagnosekodeliste;
