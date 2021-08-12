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
import NyeDokumenterSomKanPåvirkeEksisterendeVurderinger from '../nye-dokumenter-som-kan-påvirke-eksisterende-vurderinger/NyeDokumenterSomKanPåvirkeEksisterendeVurderinger';

interface NyeDokumenterSomKanPåvirkeEksisterendeVurderingerControllerProps {
    dokumenter: Dokument[];
    afterEndringerRegistrert: () => void;
}

const NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController = ({
    dokumenter,
    afterEndringerRegistrert,
}: NyeDokumenterSomKanPåvirkeEksisterendeVurderingerControllerProps): JSX.Element => {
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
                <NyeDokumenterSomKanPåvirkeEksisterendeVurderinger
                    dokumenter={dokumenter}
                    onEndringerRegistrertClick={onEndringerRegistrertClick}
                    isSubmitting={isSubmitting}
                />
            </Box>
        </PageContainer>
    );
};

export default NyeDokumenterSomKanPåvirkeEksisterendeVurderingerController;
