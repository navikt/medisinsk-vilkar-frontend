import { Element, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Dokument } from '../../../types/Dokument';
import InteractiveList from '../interactive-list/InteractiveList';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import styles from './dokumentnavigasjon.less';

interface DokumentnavigasjonProps {
    dokumenter: Dokument[];
    onDokumentValgt: (dokument: Dokument) => void;
    dokumenterSomMåGjennomgås?: Dokument[];
}

const Dokumentnavigasjon = ({ dokumenter, onDokumentValgt, dokumenterSomMåGjennomgås }: DokumentnavigasjonProps) => {
    const harDokumentasjonSomMåGjennomgås = dokumenterSomMåGjennomgås && dokumenterSomMåGjennomgås.length > 0;
    const [activeIndex, setActiveIndex] = React.useState(harDokumentasjonSomMåGjennomgås ? 0 : -1);

    const dokumentElementer = dokumenter.map((dokument) => ({
        renderer: () => <StrukturertDokumentElement dokument={dokument} />,
        dokument,
    }));
    const allElements = [...dokumentElementer];

    if (harDokumentasjonSomMåGjennomgås) {
        dokumenterSomMåGjennomgås.forEach((dokument) =>
            allElements.unshift({
                renderer: () => <UstrukturertDokumentElement dokument={dokument} />,
                dokument,
            })
        );
    }

    return (
        <>
            <Undertittel>Alle dokumenter</Undertittel>
            <div className={styles.dokumentnavigasjonContainer}>
                <div className={styles.dokumentnavigasjonContainer__columnHeadings}>
                    <Element className={styles['dokumentnavigasjonContainer__columnHeading--first']}>Status</Element>
                    <Element className={styles['dokumentnavigasjonContainer__columnHeading--second']}>Type</Element>
                    <Element className={styles['dokumentnavigasjonContainer__columnHeading--third']}>Datert</Element>
                    <Element className={styles['dokumentnavigasjonContainer__columnHeading--fourth']}>Part</Element>
                </div>
                <InteractiveList
                    elements={allElements.map((element, currentIndex) => ({
                        content: element.renderer(),
                        active: activeIndex === currentIndex,
                        key: `${currentIndex}`,
                        onClick: () => {
                            setActiveIndex(currentIndex);
                            onDokumentValgt(element.dokument);
                        },
                    }))}
                />
            </div>
        </>
    );
};

export default Dokumentnavigasjon;
