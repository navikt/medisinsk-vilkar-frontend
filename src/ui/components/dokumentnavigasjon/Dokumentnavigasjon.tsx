import { BodyShort, Label } from '@navikt/ds-react';
import { InteractiveList } from '@navikt/ft-plattform-komponenter';
import { EkspanderbartpanelBase } from 'nav-frontend-ekspanderbartpanel';
import React from 'react';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import Dokumentfilter from '../dokumentfilter/Dokumentfilter';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';
import styles from './dokumentnavigasjon.css';

interface DokumentnavigasjonProps {
    tittel: string;
    dokumenter: Dokument[];
    onDokumentValgt: (dokument: Dokument) => void;
    valgtDokument: Dokument;
    expandedByDefault?: boolean;
    displayFilterOption?: boolean;
}

const erIkkeDuplikat = (dokument: Dokument) => dokument.duplikatAvId === null;
const lagDokumentelement = (dokument: Dokument) => ({
    dokument,
    renderer: () =>
        dokument.type === Dokumenttype.UKLASSIFISERT ? (
            <UstrukturertDokumentElement dokument={dokument} />
        ) : (
            <StrukturertDokumentElement dokument={dokument} />
        ),
});

const Dokumentnavigasjon = ({
    tittel,
    dokumenter,
    onDokumentValgt,
    valgtDokument,
    expandedByDefault,
    displayFilterOption,
}: DokumentnavigasjonProps): JSX.Element => {
    const [dokumenttypeFilter, setDokumenttypeFilter] = React.useState([...Object.values(Dokumenttype)]);
    const updateDokumenttypeFilter = (type) =>
        dokumenttypeFilter.includes(type)
            ? setDokumenttypeFilter(dokumenttypeFilter.filter((v) => v !== type))
            : setDokumenttypeFilter(dokumenttypeFilter.concat([type]));

    const [listExpanded, setListExpanded] = React.useState(expandedByDefault || false);

    const filtrerteDokumenter = dokumenter.filter(
        (dokument) => dokumenttypeFilter.includes(dokument.type) && erIkkeDuplikat(dokument)
    );

    const dokumentElementer = filtrerteDokumenter.map(lagDokumentelement);

    return (
        <div className={styles.dokumentnavigasjon}>
            <EkspanderbartpanelBase tittel={tittel} apen={listExpanded} onClick={() => setListExpanded(!listExpanded)}>
                <div className={styles.dokumentnavigasjon__container}>
                    <div className={styles.dokumentnavigasjon__columnHeadings}>
                        <Label size="small" className={styles['dokumentnavigasjon__columnHeading--first']}>
                            Status
                        </Label>
                        {!displayFilterOption && (
                            <Label size="small" className={styles['dokumentnavigasjon__columnHeading--second']}>
                                Type
                            </Label>
                        )}
                        {displayFilterOption && (
                            <Dokumentfilter
                                className={styles['dokumentnavigasjon__columnHeading--second']}
                                text="Type"
                                filters={dokumenttypeFilter}
                                onFilterChange={updateDokumenttypeFilter}
                            />
                        )}
                        <Label size="small" className={styles['dokumentnavigasjon__columnHeading--third']}>
                            Datert
                        </Label>
                        <Label size="small" className={styles['dokumentnavigasjon__columnHeading--fourth']}>
                            Part
                        </Label>
                    </div>
                    {dokumentElementer.length === 0 && (
                        <div style={{ padding: '0.5rem 1rem 1rem 1rem' }}>
                            <BodyShort size="small">Ingen dokumenter å vise</BodyShort>
                        </div>
                    )}
                    <InteractiveList
                        elements={dokumentElementer
                            .filter((element) => dokumenttypeFilter.includes(element?.dokument?.type))
                            .map((element, currentIndex) => ({
                                content: element.renderer(),
                                active: element.dokument === valgtDokument,
                                key: `${currentIndex}`,
                                onClick: () => onDokumentValgt(element.dokument),
                            }))}
                    />
                </div>
            </EkspanderbartpanelBase>
        </div>
    );
};

export default Dokumentnavigasjon;
