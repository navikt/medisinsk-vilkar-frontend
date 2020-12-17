import React from 'react';
import DetailView from '../detail-view/DetailView';

interface StrukturertDokumentDetaljerProps {
    dokumentNavn: string;
}

const StrukturertDokumentDetaljer = ({ dokumentNavn }: StrukturertDokumentDetaljerProps) => {
    return <DetailView title={`Detaljer for dokument: ${dokumentNavn}`}>Her er detaljene</DetailView>;
};

export default StrukturertDokumentDetaljer;
