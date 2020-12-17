import React from 'react';

interface UstrukturertDokumentElementProps {
    dokument: string;
}

const UstrukturertDokumentElement = ({ dokument }: UstrukturertDokumentElementProps) => {
    return <div>{dokument}</div>;
};

export default UstrukturertDokumentElement;
