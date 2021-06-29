import { prettifyDateString } from '@navikt/k9-date-utils';
import { BucketIcon, ContentWithTooltip } from '@navikt/k9-react-components';
import Lenke from 'nav-frontend-lenker';
import React, { useState } from 'react';
import Dokument from '../../../types/Dokument';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './duplikatliste.less';
import SlettDuplikatModal from '../slett-duplikat-modal/SlettDuplikatModal';
import LinkRel from '../../../constants/LinkRel';
import { findLinkByRel } from '../../../util/linkUtils';

interface DuplikatlisteProps {
    dokumenter: Dokument[];
    onDeleteClick: (dokument: Dokument) => void;
}

const Duplikatliste = ({ dokumenter, onDeleteClick }: DuplikatlisteProps): JSX.Element => {
    const [isModalOpen, setModalIsOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    return (
        <>
            <ul className={styles.dokumentliste}>
                {dokumenter.map((dokument) => {
                    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);
                    return (
                        <li key={`${dokument.id}`} className={styles.dokumentliste__element}>
                            <Lenke href={dokumentLink.href} className={styles.dokumentliste__beskrivelse}>
                                {`${dokument.navn} - ${prettifyDateString(dokument.datert)}`}
                            </Lenke>
                            <WriteAccessBoundContent
                                contentRenderer={() => (
                                    <ContentWithTooltip tooltipText="Fjern som duplikat">
                                        <button
                                            className={styles.dokumentliste__deleteButton}
                                            type="button"
                                            onClick={() => {
                                                setModalIsOpen(true);
                                                setSelectedDocument(dokument);
                                            }}
                                            aria-label="Fjern som duplikat"
                                        >
                                            <BucketIcon />
                                        </button>
                                    </ContentWithTooltip>
                                )}
                            />
                        </li>
                    );
                })}
            </ul>
            {isModalOpen && (
                <SlettDuplikatModal
                    onDelete={() => {
                        onDeleteClick(selectedDocument);
                        setModalIsOpen(false);
                    }}
                    handleCloseModal={() => setModalIsOpen(false)}
                />
            )}
        </>
    );
};
export default Duplikatliste;
