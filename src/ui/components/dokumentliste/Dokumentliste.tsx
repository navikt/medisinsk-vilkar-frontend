import { InteractiveList } from '@navikt/k9-react-components';
import React from 'react';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import StrukturertDokumentElement from '../strukturet-dokument-element/StrukturertDokumentElement';
import UstrukturertDokumentElement from '../ustrukturert-dokument-element/UstrukturertDokumentElement';

interface DokumentlisteProps {
    dokumenter: Dokument[];
    onDokumentValgt: (index: number, dokument: Dokument) => void;
    activeIndex: number;
}

const Dokumentliste = ({ dokumenter, onDokumentValgt, activeIndex }: DokumentlisteProps): JSX.Element => {
    const ustrukturerteDokumenter = dokumenter.filter(({ type }) => type === Dokumenttype.UKLASSIFISERT);
    const strukturerteDokumenter = dokumenter.filter(({ type }) => type !== Dokumenttype.UKLASSIFISERT);

    const elements = [];
    elements.push(
        ...ustrukturerteDokumenter.map((ustrukturertDokument) => ({
            renderer: () => <UstrukturertDokumentElement dokument={ustrukturertDokument} />,
            dokument: ustrukturertDokument,
        }))
    );
    elements.push(
        ...strukturerteDokumenter.map((strukturertDokument) => ({
            renderer: () => <StrukturertDokumentElement dokument={strukturertDokument} />,
            dokument: strukturertDokument,
        }))
    );
    return (
        <InteractiveList
            elements={elements.map((element, currentIndex) => ({
                content: element.renderer(),
                active: activeIndex === currentIndex,
                key: `${currentIndex}`,
                onClick: () => onDokumentValgt(currentIndex, element.dokument),
            }))}
        />
    );
};

export default Dokumentliste;
