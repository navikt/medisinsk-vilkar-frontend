import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import Dokument from '../../../types/Dokument';
import StrukturerDokumentForm from '../strukturer-dokument-form/StrukturerDokumentForm';
import { submitData } from '../../../util/httpUtils';

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
    const fetchAborter = useMemo(() => new AbortController(), []);
    const { signal } = fetchAborter;

    React.useEffect(() => {
        return () => {
            fetchAborter.abort();
        };
    }, []);

    const strukturerDokument = (strukturertDokument) => {
        setIsLoading(true);
        submitData(strukturerDokumentUrl, strukturertDokument, signal).then(
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
