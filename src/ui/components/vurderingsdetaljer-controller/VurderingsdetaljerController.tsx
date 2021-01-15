import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import Vurdering from '../../../types/Vurdering';
import { fetchData } from '../../../util/httpUtils';
import PageError from '../page-error/PageError';

interface VurderingsdetaljerControllerProps {
    hentVurderingUrl: string;
    contentRenderer: (vurdering: Vurdering) => JSX.Element;
}

const VurderingsdetaljerController = ({
    hentVurderingUrl,
    contentRenderer,
}: VurderingsdetaljerControllerProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<Vurdering>(null);
    const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);

    const fetchAborter = useMemo(() => new AbortController(), [hentVurderingUrl]);
    const { signal } = fetchAborter;

    function hentVurdering(): Promise<Vurdering> {
        return fetchData(hentVurderingUrl, { signal });
    }

    const handleError = () => {
        setIsLoading(false);
        setHentVurderingHarFeilet(true);
    };

    React.useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setHentVurderingHarFeilet(false);
        hentVurdering()
            .then((vurderingResponse: Vurdering) => {
                if (isMounted) {
                    setVurdering(vurderingResponse);
                    setIsLoading(false);
                }
            })
            .catch(handleError);

        return () => {
            isMounted = false;
            fetchAborter.abort();
        };
    }, [hentVurderingUrl]);

    if (isLoading) {
        return <Spinner />;
    }
    if (hentVurderingHarFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    return contentRenderer(vurdering);
};

export default VurderingsdetaljerController;
