import { prettifyDateString } from '@navikt/k9-date-utils';
import { Box, DocumentIcon, Margin } from '@navikt/k9-react-components';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './vurderNyttDokument.less';

interface VurderNyttDokumentProps {
    dokumenter: Dokument[];
}

const VurderNyttDokument = ({ dokumenter }: VurderNyttDokumentProps): JSX.Element => (
    <Box marginTop={Margin.large} marginBottom={Margin.large}>
        <div className={styles.vurderDokument}>
            <AlertStripeAdvarsel>
                Vurder nytt dokument. Dokumentet er ikke knyttet til en behandling.
            </AlertStripeAdvarsel>
            <Box marginTop={Margin.large}>
                <div className={styles.vurderDokument__content}>
                    <Element>Vurder om nytt dokument fører til endringer i eksisterende vurderinger.</Element>
                    {dokumenter.map((dokument) => {
                        const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);
                        return (
                            <p key={dokument.id}>
                                Nytt dokument:
                                <a href={dokumentLink.href} className={styles.vurderDokument__dokumentLink}>
                                    <span className={styles.vurderDokument__ikonContainer}>
                                        <DocumentIcon />
                                    </span>
                                    {`${dokument.navn} - ${prettifyDateString(dokument.datert)}`}
                                </a>
                            </p>
                        );
                    })}
                    <Box marginTop={Margin.large}>
                        <Hovedknapp mini>Utført, eventuelle endringer er registrert</Hovedknapp>
                    </Box>
                </div>
            </Box>
        </div>
    </Box>
);

export default VurderNyttDokument;
