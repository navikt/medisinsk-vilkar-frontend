import React, { useMemo } from 'react';
import axios from 'axios';
import Spinner from 'nav-frontend-spinner';
import NyVurderingAvTilsynsbehovForm, {
    FieldName,
} from '../ny-vurdering-av-tilsynsbehov-form/NyVurderingAvTilsynsbehovForm';
import { Period } from '../../../types/Period';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { fetchData, submitData } from '../../../util/httpUtils';
import RequestPayload from '../../../types/RequestPayload';
import Vurderingstype from '../../../types/Vurderingstype';
import Link from '../../../types/Link';
import PageError from '../page-error/PageError';

interface NyVurderingAvTilsynsbehovControllerProps {
    opprettVurderingLink: Link;
    dataTilVurderingUrl: string;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

const NyVurderingAvTilsynsbehovController = ({
    opprettVurderingLink,
    dataTilVurderingUrl,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: NyVurderingAvTilsynsbehovControllerProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [hentDataTilVurderingHarFeilet, setHentDataTilVurderingHarFeilet] = React.useState<boolean>(false);
    const [dokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        return submitData<RequestPayload>(
            opprettVurderingLink.href,
            {
                behandlingUuid: opprettVurderingLink.payload.behandlingUuid,
                perioder: nyVurderingsversjon.perioder,
                resultat: nyVurderingsversjon.resultat,
                tekst: nyVurderingsversjon.tekst,
                tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
                type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
            },
            { cancelToken: httpCanceler.token }
        );
    }

    const lagreVurderingAvTilsynsbehov = (nyVurderingsversjon: Vurderingsversjon) => {
        setIsLoading(true);
        lagreVurdering(nyVurderingsversjon).then(
            () => {
                onVurderingLagret();
                setIsLoading(false);
            },
            () => {
                // showErrorMessage ??
                setIsLoading(false);
            }
        );
    };

    function hentDataTilVurdering(): Promise<Dokument[]> {
        if (!dataTilVurderingUrl) {
            return new Promise((resolve) => resolve([]));
        }
        return fetchData(dataTilVurderingUrl, { cancelToken: httpCanceler.token });
    }

    const handleError = () => {
        setIsLoading(false);
        setHentDataTilVurderingHarFeilet(true);
    };

    React.useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setHentDataTilVurderingHarFeilet(false);
        hentDataTilVurdering()
            .then((dokumenterResponse: Dokument[]) => {
                if (isMounted) {
                    setDokumenter(dokumenterResponse);
                    setIsLoading(false);
                }
            })
            .catch(handleError);

        return () => {
            isMounted = false;
            httpCanceler.cancel();
        };
    }, []);

    if (isLoading) {
        return <Spinner />;
    }
    if (hentDataTilVurderingHarFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }
    return (
        <NyVurderingAvTilsynsbehovForm
            defaultValues={{
                [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                [FieldName.PERIODER]: resterendeVurderingsperioder,
                [FieldName.DOKUMENTER]: [],
            }}
            resterendeVurderingsperioder={resterendeVurderingsperioder}
            perioderSomKanVurderes={perioderSomKanVurderes}
            dokumenter={dokumenter}
            onSubmit={lagreVurderingAvTilsynsbehov}
        />
    );
};

export default NyVurderingAvTilsynsbehovController;
