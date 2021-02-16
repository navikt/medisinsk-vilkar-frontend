import React, { useMemo } from 'react';
import axios from 'axios';
import Spinner from 'nav-frontend-spinner';
import Vurdering from '../../../types/Vurdering';
import { get } from '../../../util/httpUtils';
import PageError from '../page-error/PageError';
import ContainerContext from '../../context/ContainerContext';

interface VurderingsdetaljerControllerProps {
    hentVurderingUrl: string;
    contentRenderer: (vurdering: Vurdering) => JSX.Element;
}

const VurderingsdetaljerController = ({
    hentVurderingUrl,
    contentRenderer,
}: VurderingsdetaljerControllerProps): JSX.Element => {
    const { httpErrorHandler } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<Vurdering>(null);
    const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);

    const httpCanceler = useMemo(() => axios.CancelToken.source(), [hentVurderingUrl]);

    function hentVurdering(): Promise<Vurdering> {
        return get(hentVurderingUrl, httpErrorHandler, { cancelToken: httpCanceler.token });
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
            httpCanceler.cancel();
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
