import { post } from '@navikt/k9-http-utils';
import { Box, Margin } from '@navikt/k9-react-components';
import axios from 'axios';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import React, { useMemo } from 'react';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import scrollUp from '../../../util/viewUtils';
import ContainerContext from '../../context/ContainerContext';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';

interface StrukturerDokumentControllerProps {
    strukturerDokumentLink: Link;
    dokument: Dokument;
    onDokumentStrukturert: () => void;
    editMode?: boolean;
    strukturerteDokumenter: Dokument[];
}

const StrukturerDokumentController = ({
    dokument,
    strukturerDokumentLink: { requestPayload, href },
    onDokumentStrukturert,
    editMode,
    strukturerteDokumenter,
}: StrukturerDokumentControllerProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);
    const [submitDocumentError, setSubmitDocumentError] = React.useState(null);

    React.useEffect(
        () => () => {
            httpCanceler.cancel();
        },
        []
    );

    const strukturerDokument = (strukturertDokument: Dokument) => {
        setIsSubmitting(true);
        setSubmitDocumentError(null);
        post(href, { ...requestPayload, ...strukturertDokument }, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        }).then(
            () => {
                setIsSubmitting(false);
                onDokumentStrukturert();
                scrollUp();
            },
            (error) => {
                setSubmitDocumentError(error);
                setIsSubmitting(false);
                scrollUp();
            }
        );
    };

    const hasError = !!submitDocumentError;
    const getErrorMessage = () => {
        if (submitDocumentError?.response?.data?.feilmelding) {
            return `${submitDocumentError.response.data.feilmelding}`;
        }
        return null;
    };

    return (
        <>
            {hasError && (
                <Box marginBottom={Margin.medium}>
                    <AlertStripeFeil>{getErrorMessage()}</AlertStripeFeil>
                </Box>
            )}
            <StrukturerDokumentForm
                dokument={dokument}
                onSubmit={strukturerDokument}
                editMode={editMode}
                isSubmitting={isSubmitting}
                strukturerteDokumenter={strukturerteDokumenter}
            />
            {hasError && (
                <Box marginTop={Margin.medium}>
                    <AlertStripeFeil>{getErrorMessage()}</AlertStripeFeil>
                </Box>
            )}
        </>
    );
};

export default StrukturerDokumentController;
