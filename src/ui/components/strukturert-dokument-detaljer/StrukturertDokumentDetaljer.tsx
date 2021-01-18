import React from 'react';
import DetailView from '../detail-view/DetailView';
import { StrukturertDokument } from '../../../types/Dokument';

interface StrukturertDokumentDetaljerProps {
    dokument: StrukturertDokument;
}

const StrukturertDokumentDetaljer = ({ dokument }: StrukturertDokumentDetaljerProps) => {
    const { navn } = dokument;
    return <DetailView title={`Detaljer for dokument: ${navn}`}>Her er detaljene</DetailView>;
};

export default StrukturertDokumentDetaljer;
