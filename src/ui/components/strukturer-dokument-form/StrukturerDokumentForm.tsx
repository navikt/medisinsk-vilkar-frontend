import React from 'react';
import DetailView from '../detail-view/DetailView';

interface StrukturerDokumentFormProps {
    dokumentNavn: string;
}

const StrukturerDokumentForm = ({ dokumentNavn }: StrukturerDokumentFormProps) => {
    return <DetailView title={`Nytt dokument ("${dokumentNavn}")`}>Test</DetailView>;
};

export default StrukturerDokumentForm;
