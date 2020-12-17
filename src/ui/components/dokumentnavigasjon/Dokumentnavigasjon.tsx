import React from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import InteractiveList from '../interactive-list/InteractiveList';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import styles from './dokumentnavigasjon.less';

interface DokumentnavigasjonProps {
    dokumenter: string[];
    onDokumentValgt: (legerklæring: string) => void;
    dokumenterSomMåGjennomgås?: string[];
}

const Dokumentnavigasjon = ({ dokumenter, onDokumentValgt, dokumenterSomMåGjennomgås }: DokumentnavigasjonProps) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const dokumentElementer = dokumenter.map((dokument) => <StrukturertDokumentElement dokument={dokument} />);
    const allElements = [...dokumentElementer];

    const harDokumentasjonSomMåGjennomgås = dokumenterSomMåGjennomgås && dokumenterSomMåGjennomgås.length > 0;
    if (harDokumentasjonSomMåGjennomgås) {
        allElements.unshift(<UstrukturertDokumentElement dokument={dokumenterSomMåGjennomgås[0]} />);
    }

    return (
        <>
            <Undertittel>Alle dokumenter</Undertittel>
            <div className={styles.dokumentnavigasjonContainer}>
                <InteractiveList
                    elements={allElements.map((element, currentIndex) => ({
                        content: element,
                        active: activeIndex === currentIndex,
                        key: `${currentIndex}`,
                        onClick: () => {
                            setActiveIndex(currentIndex);
                            const dokumentIndex = dokumentElementer.indexOf(element);
                            onDokumentValgt(dokumenter[dokumentIndex]);
                        },
                    }))}
                />
            </div>
        </>
    );
};

export default Dokumentnavigasjon;
