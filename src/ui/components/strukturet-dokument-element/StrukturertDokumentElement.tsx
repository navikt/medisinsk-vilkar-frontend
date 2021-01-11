import React from 'react';
import { StrukturertDokument } from '../../../types/Dokument';

interface StrukturertDokumentElementProps {
    dokument: StrukturertDokument;
}

const StrukturertDokumentElement = ({ dokument }: StrukturertDokumentElementProps) => {
    return <div>{dokument.navn}</div>;
};

export default StrukturertDokumentElement;
