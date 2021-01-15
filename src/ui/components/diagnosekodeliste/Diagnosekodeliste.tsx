import React from 'react';
import Lenke from 'nav-frontend-lenker';
import styles from './diagnosekodeliste.less';

interface DiagnosekodelisteProps {
    diagnosekoder: string[];
    onDeleteClick: (diagnosekode: string) => void;
}

const Diagnosekodeliste = ({ diagnosekoder, onDeleteClick }: DiagnosekodelisteProps) => {
    return (
        <ul className={styles.diagnosekodeliste}>
            {diagnosekoder.map((diagnosekode) => {
                return (
                    <li key={diagnosekode} className={styles.diagnosekodeliste__element}>
                        {diagnosekode}
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
                    </li>
                );
            })}
        </ul>
    );
};

export default Diagnosekodeliste;
