import React from 'react';
import Lenke from 'nav-frontend-lenker';
import DetailView from '../detail-view/DetailView';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import Box, { Margin } from '../box/Box';
import LabelledContent from '../labelled-content/LabelledContent';
import { prettifyDate } from '../../../util/formats';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';

interface StrukturertDokumentDetaljerProps {
    dokument: Dokument;
}

const renderDokumenttypeContent = (dokumenttype: Dokumenttype) => {
    if (dokumenttype === Dokumenttype.LEGEERKLÆRING) {
        return <span>Ja, legeerklæring fra sykehus/spesialisthelsetjenesten</span>;
    }
    if (dokumenttype === Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER) {
        return (
            <span>Ja, andre medisinske opplysninger (f.eks. legeerklæring fra fastlege, uttalelse fra psykolog)</span>
        );
    }
    if (dokumenttype === Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER) {
        return <span>Dokumentet inneholder ikke medisinske opplysninger</span>;
    }
    return null;
};

const StrukturertDokumentDetaljer = ({ dokument }: StrukturertDokumentDetaljerProps) => {
    const { type, datert, links } = dokument;
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
    return (
        <DetailView title="Om dokumentet">
            <Box marginTop={Margin.xLarge}>
                <Lenke href={dokumentLink.href} target="_blank">
                    Åpne dokument
                </Lenke>
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent
                    label="Inneholder dokumentet medisinske opplysninger?"
                    content={renderDokumenttypeContent(type)}
                />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent label="Når er dokumentet datert?" content={prettifyDate(datert)} />
            </Box>
        </DetailView>
    );
};

export default StrukturertDokumentDetaljer;
