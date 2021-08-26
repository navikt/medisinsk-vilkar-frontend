import { InteractiveList } from '@navikt/k9-react-components';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import ChevronDropdown from '../chevron-dropdown/ChevronDropdown';
import styles from './dokumentnavigasjon.less';

interface DokumentnavigasjonProps {
    dokumenter: Dokument[];
    onDokumentValgt: (dokument: Dokument) => void;
    dokumenterSomMåGjennomgås?: Dokument[];
}

const Dokumentnavigasjon = ({
    dokumenter,
    onDokumentValgt,
    dokumenterSomMåGjennomgås,
}: DokumentnavigasjonProps): JSX.Element => {
    const harDokumentasjonSomMåGjennomgås = dokumenterSomMåGjennomgås && dokumenterSomMåGjennomgås.length > 0;
    const [activeIndex, setActiveIndex] = React.useState(harDokumentasjonSomMåGjennomgås ? 0 : -1);
    const [dokumenttypeFilter, setDokumenttypeFilter] = React.useState([...Object.values(Dokumenttype)]);
    const filtrerDokumenttype = (type) =>
        dokumenttypeFilter.includes(type)
            ? setDokumenttypeFilter(dokumenttypeFilter.filter((v) => v !== type))
            : setDokumenttypeFilter(dokumenttypeFilter.concat([type]));

    const dokumentElementer = dokumenter
        .filter((dokument) => dokument.duplikatAvId == null)
        .map((dokument) => ({
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
        <div className={styles.dokumentnavigasjon}>
            <Undertittel className={styles.dokumentnavigasjon__heading}>Alle dokumenter</Undertittel>
            <div className={styles.dokumentnavigasjon__container}>
                <div className={styles.dokumentnavigasjon__columnHeadings}>
                    <Element className={styles['dokumentnavigasjon__columnHeading--first']}>Status</Element>
                    <ChevronDropdown
                        className={styles['dokumentnavigasjon__columnHeading--second']}
                        text="Type"
                        dokumenttypeFilter={dokumenttypeFilter}
                        filtrerDokumenttype={filtrerDokumenttype}
                    />
                    <Element className={styles['dokumentnavigasjon__columnHeading--third']}>Datert</Element>
                    <Element className={styles['dokumentnavigasjon__columnHeading--fourth']}>Part</Element>
                </div>
                <InteractiveList
                    elements={allElements
                        .filter((element) => dokumenttypeFilter.includes(element?.dokument?.type))
                        .map((element, currentIndex) => ({
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
        </div>
    );
};

export default Dokumentnavigasjon;
