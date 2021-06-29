import { post } from '@navikt/k9-http-utils';
import React, { useMemo } from 'react';
import axios from 'axios';
import Dokument from '../../../types/Dokument';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import Link from '../../../types/Link';
import ContainerContext from '../../context/ContainerContext';
import scrollUp from '../../../util/viewUtils';

interface StrukturerDokumentControllerProps {
    strukturerDokumentLink: Link;
    dokument: Dokument;
    onDokumentStrukturert: () => void;
    editMode?: boolean;
    alleStrukturerteDokumenter: Dokument[];
}

const StrukturerDokumentController = ({
    dokument,
    strukturerDokumentLink: { requestPayload, href },
    onDokumentStrukturert,
    editMode,
    alleStrukturerteDokumenter,
}: StrukturerDokumentControllerProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    React.useEffect(
        () => () => {
            httpCanceler.cancel();
        },
        []
    );

    const strukturerDokument = (strukturertDokument: Dokument) => {
        setIsSubmitting(true);
        post(href, { ...requestPayload, ...strukturertDokument }, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        }).then(
            () => {
                setIsSubmitting(false);
                onDokumentStrukturert();
                scrollUp();
            },
            () => {
                setIsSubmitting(false);
                scrollUp();
            }
        );
    };

    return (
        <StrukturerDokumentForm
            dokument={dokument}
            onSubmit={strukturerDokument}
            editMode={editMode}
            isSubmitting={isSubmitting}
            alleStrukturerteDokumenter={alleStrukturerteDokumenter}
        />
    );
};

export default StrukturerDokumentController;
