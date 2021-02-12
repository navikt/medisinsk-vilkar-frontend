import React from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';
import InteractiveList from '../interactive-list/InteractiveList';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import { Dokument } from '../../../types/Dokument';
import styles from './dokumentnavigasjon.less';

interface DokumentnavigasjonProps {
    dokumenter: Dokument[];
    onDokumentValgt: (dokument: Dokument) => void;
    dokumenterSomMåGjennomgås?: Dokument[];
}

const Dokumentnavigasjon = ({ dokumenter, onDokumentValgt, dokumenterSomMåGjennomgås }: DokumentnavigasjonProps) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const dokumentElementer = dokumenter.map((dokument) => ({
        renderer: () => <StrukturertDokumentElement dokument={dokument} />,
        dokument,
    }));
    const allElements = [...dokumentElementer];

    const harDokumentasjonSomMåGjennomgås = dokumenterSomMåGjennomgås && dokumenterSomMåGjennomgås.length > 0;
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
                    <Element>Type</Element>
                    <Element className={styles['dokumentnavigasjonContainer__columnHeading--second']}>Datert</Element>
                    <Element className={styles['dokumentnavigasjonContainer__columnHeading--third']}>Status</Element>
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
