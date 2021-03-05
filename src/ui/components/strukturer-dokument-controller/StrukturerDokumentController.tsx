import React, { useMemo } from 'react';
import axios from 'axios';
import Spinner from 'nav-frontend-spinner';
import Dokument from '../../../types/Dokument';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import { post } from '../../../util/httpUtils';
import Link from '../../../types/Link';
import ContainerContext from '../../context/ContainerContext';
import { scrollUp } from '../../../util/viewUtils';

interface StrukturerDokumentControllerProps {
    strukturerDokumentLink: Link;
    ustrukturertDokument: Dokument;
    onDokumentStrukturert: () => void;
}

const StrukturerDokumentController = ({
    ustrukturertDokument,
    strukturerDokumentLink: { requestPayload, href },
    onDokumentStrukturert,
}: StrukturerDokumentControllerProps) => {
    const { httpErrorHandler } = React.useContext(ContainerContext);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    React.useEffect(() => {
        return () => {
            httpCanceler.cancel();
        };
    }, []);

    const strukturerDokument = (strukturertDokument) => {
        setIsLoading(true);
        post(href, { ...requestPayload, ...strukturertDokument }, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        }).then(
            () => {
                setIsLoading(false);
                onDokumentStrukturert();
                scrollUp();
            },
            (error) => {
                setIsLoading(false);
                console.error(error);
                scrollUp();
            }
        );
    };

    if (isLoading) {
        return <Spinner />;
    }
    return <StrukturerDokumentForm dokument={ustrukturertDokument} onSubmit={strukturerDokument} />;
};

export default StrukturerDokumentController;
