import React from 'react';

interface StrukturertDokumentElementProps {
    dokument: string;
}

const StrukturertDokumentElement = ({ dokument }: StrukturertDokumentElementProps) => {
    return <div>{dokument}</div>;
};

export default StrukturertDokumentElement;
