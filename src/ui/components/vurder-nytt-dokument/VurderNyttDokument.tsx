import React, { useMemo } from 'react';
import axios from 'axios';
import { prettifyDateString } from '@navikt/k9-date-utils';
import { Box, DocumentIcon, Margin, PageContainer } from '@navikt/k9-react-components';
import { post } from '@navikt/k9-http-utils';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Element } from 'nav-frontend-typografi';
import LinkRel from '../../../constants/LinkRel';
import Dokument from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import styles from './vurderNyttDokument.less';

interface VurderNyttDokumentProps {
    dokumenter: Dokument[];
    afterEndringerRegistrert: () => void;
}

const VurderNyttDokument = ({ dokumenter, afterEndringerRegistrert }: VurderNyttDokumentProps): JSX.Element => {
    const { endpoints, httpErrorHandler, behandlingUuid } = React.useContext(ContainerContext);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [httpErrorHasOccured, setHttpErrorHasOccured] = React.useState(false);

    const createRegistrerNyeDokumenterRequestPayload = () => ({
        behandlingUuid,
        dokmenterSomSkalUtkvitteres: dokumenter.map(({ id }) => id),
    });

    const bekreftAtEndringerErRegistrert = () =>
        post(endpoints.nyeDokumenter, createRegistrerNyeDokumenterRequestPayload(), httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });

    const onEndringerRegistrertClick = async () => {
        setIsSubmitting(true);
        setHttpErrorHasOccured(false);
        try {
            await bekreftAtEndringerErRegistrert();
            afterEndringerRegistrert();
            setIsSubmitting(false);
        } catch (error) {
            setHttpErrorHasOccured(true);
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer hasError={httpErrorHasOccured}>
            <Box marginTop={Margin.large} marginBottom={Margin.large}>
                <div className={styles.vurderDokument}>
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
                                <Hovedknapp
                                    mini
                                    onClick={() => onEndringerRegistrertClick()}
                                    disabled={isSubmitting}
                                    spinner={isSubmitting}
                                >
                                    Utført, eventuelle endringer er registrert
                                </Hovedknapp>
                            </Box>
                        </div>
                    </Box>
                </div>
            </Box>
        </PageContainer>
    );
};

export default VurderNyttDokument;
