import { prettifyDateString } from '@navikt/k9-date-utils';
import { Box, DetailView, LabelledContent, LinkButton, Margin } from '@navikt/k9-react-components';
import Alertstripe from 'nav-frontend-alertstriper';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { Dokumenttype } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';
import Duplikatliste from '../duplikatliste/Duplikatliste';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import styles from './strukturertDokumentDetaljer.less';

interface StrukturertDokumentDetaljerProps {
    dokument: Dokument;
    onEditDokumentClick: () => void;
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

const StrukturertDokumentDetaljer = ({
    dokument,
    onEditDokumentClick,
}: StrukturertDokumentDetaljerProps): JSX.Element => {
    const { type, datert, links, duplikater } = dokument;
    const harDuplikater = duplikater?.length > 0;
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
    return (
        <DetailView
            title="Om dokumentet"
            contentAfterTitleRenderer={() => (
                <WriteAccessBoundContent
                    contentRenderer={() => (
                        <LinkButton className={styles.endreLink} onClick={onEditDokumentClick}>
                            Endre dokument
                        </LinkButton>
                    )}
                />
            )}
        >
            {harDuplikater && (
                <Box marginTop={Margin.xLarge}>
                    <Alertstripe type="info">Det finnes ett eller flere duplikater av dette dokumentet.</Alertstripe>
                </Box>
            )}
            <Box marginTop={Margin.xLarge}>
                <DokumentKnapp href={dokumentLink.href} />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent
                    label="Inneholder dokumentet medisinske opplysninger?"
                    content={renderDokumenttypeContent(type)}
                />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent label="Når er dokumentet datert?" content={prettifyDateString(datert)} />
            </Box>
            {harDuplikater && (
                <Box marginTop={Margin.xLarge}>
                    <LabelledContent
                        label="Duplikater av dette dokumentet:"
                        content={<Duplikatliste dokumenter={duplikater} onDeleteClick={() => null} />}
                    />
                </Box>
            )}
        </DetailView>
    );
};

export default StrukturertDokumentDetaljer;
