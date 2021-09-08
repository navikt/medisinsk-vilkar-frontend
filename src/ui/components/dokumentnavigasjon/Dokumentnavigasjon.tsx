import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import ChevronDropdown from '../chevron-dropdown/ChevronDropdown';
import Dokumentliste from '../dokumentliste/Dokumentliste';
import styles from './dokumentnavigasjon.less';

interface DokumentnavigasjonProps {
    dokumenter: Dokument[];
    onDokumentValgt: (dokument: Dokument) => void;
    visAlleDokumenter: boolean;
}

const Dokumentnavigasjon = ({
    dokumenter,
    onDokumentValgt,
    visAlleDokumenter,
}: DokumentnavigasjonProps): JSX.Element => {
    const harDokumentasjonSomMåGjennomgås =
        dokumenter && dokumenter.some((dokument) => dokument.type === Dokumenttype.UKLASSIFISERT);
    const [activeIndex, setActiveIndex] = React.useState(harDokumentasjonSomMåGjennomgås ? 0 : -1);
    const [dokumenttypeFilter, setDokumenttypeFilter] = React.useState([...Object.values(Dokumenttype)]);

    const oppdaterDokumentfilter = (type) =>
        dokumenttypeFilter.includes(type)
            ? setDokumenttypeFilter(dokumenttypeFilter.filter((v) => v !== type))
            : setDokumenttypeFilter(dokumenttypeFilter.concat([type]));

    let filtrerteDokumenter = dokumenter;
    if (!visAlleDokumenter) {
        filtrerteDokumenter = filtrerteDokumenter
            .filter(({ type }) => type === Dokumenttype.UKLASSIFISERT)
            .filter((dokument) => dokument.duplikatAvId == null);
    }

    const oppdaterValgtDokument = (index: number, dokument: Dokument) => {
        setActiveIndex(index);
        onDokumentValgt(dokument);
    };

    return (
        <div className={styles.dokumentnavigasjon}>
            <Undertittel className={styles.dokumentnavigasjon__heading}>Alle dokumenter</Undertittel>
            <div className={styles.dokumentnavigasjon__container}>
                <div className={styles.dokumentnavigasjon__columnHeadings}>
                    <Element className={styles['dokumentnavigasjon__columnHeading--first']}>Status</Element>
                    <ChevronDropdown
                        className={styles['dokumentnavigasjon__columnHeading--second']}
                        text="Type"
                        dokumenttypeFilter={dokumenttypeFilter}
                        oppdaterDokumentFilter={oppdaterDokumentfilter}
                    />
                    <Element className={styles['dokumentnavigasjon__columnHeading--third']}>Datert</Element>
                    <Element className={styles['dokumentnavigasjon__columnHeading--fourth']}>Part</Element>
                </div>
                {filtrerteDokumenter.length === 0 && (
                    <Normaltekst style={{ padding: '0rem 1rem 1rem 1rem' }}>Ingen dokumenter å vise</Normaltekst>
                )}
                {filtrerteDokumenter.length >= 1 && (
                    <Dokumentliste
                        dokumenter={filtrerteDokumenter}
                        onDokumentValgt={oppdaterValgtDokument}
                        activeIndex={activeIndex}
                    />
                )}
            </div>
        </div>
    );
};

export default Dokumentnavigasjon;
