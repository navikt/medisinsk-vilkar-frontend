import React from 'react';
import Lenke from 'nav-frontend-lenker';
import styles from './diagnosekodeliste.less';
import Diagnosekode from '../../../types/Diagnosekode';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';

interface DiagnosekodelisteProps {
    diagnosekoder: Diagnosekode[];
    onDeleteClick: (diagnosekode: Diagnosekode) => void;
}

const Diagnosekodeliste = ({ diagnosekoder, onDeleteClick }: DiagnosekodelisteProps) => {
    return (
        <ul className={styles.diagnosekodeliste}>
            {diagnosekoder.map((diagnosekode, index) => {
                return (
                    <li key={`${diagnosekode.kode}${index}`} className={styles.diagnosekodeliste__element}>
                        <p className={styles.beskrivelse}>{diagnosekode.beskrivelse}</p>
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
                );
            })}
        </ul>
    );
};

export default Diagnosekodeliste;
