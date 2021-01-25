import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import Dokument from '../../../types/Dokument';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import { submitData } from '../../../util/httpUtils';
import axios from 'axios';

interface StrukturerDokumentControllerProps {
    strukturerDokumentUrl: string;
    ustrukturertDokument: Dokument;
    onDokumentStrukturert: () => void;
}

const StrukturerDokumentController = ({
    ustrukturertDokument,
    strukturerDokumentUrl,
    onDokumentStrukturert,
}: StrukturerDokumentControllerProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    React.useEffect(() => {
        return () => {
            httpCanceler.cancel();
        };
    }, []);

    const strukturerDokument = (strukturertDokument) => {
        setIsLoading(true);
        submitData(strukturerDokumentUrl, strukturertDokument, { cancelToken: httpCanceler.token }).then(
            () => {
                setIsLoading(false);
                onDokumentStrukturert();
            },
            (error) => {
                setIsLoading(false);
                console.error(error);
            }
        );
    };

    if (isLoading) {
        return <Spinner />;
    }
    return <StrukturerDokumentForm dokument={ustrukturertDokument} onSubmit={strukturerDokument} />;
};

export default StrukturerDokumentController;
