import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import axios from 'axios';
import NyVurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner-form/NyVurderingAvToOmsorgspersonerForm';
import { Period } from '../../../types/Period';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { fetchData, submitData } from '../../../util/httpUtils';
import RequestPayload from '../../../types/RequestPayload';
import Vurderingstype from '../../../types/Vurderingstype';
import Link from '../../../types/Link';
import PageError from '../page-error/PageError';

interface NyVurderingAvToOmsorgspersonerControllerProps {
    opprettVurderingLink: Link;
    dataTilVurderingUrl: string;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

const NyVurderingAvToOmsorgspersonerController = ({
    opprettVurderingLink,
    dataTilVurderingUrl,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: NyVurderingAvToOmsorgspersonerControllerProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [hentDataTilVurderingHarFeilet, setHentDataTilVurderingHarFeilet] = React.useState<boolean>(false);
    const [dokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        return submitData<RequestPayload>(
            opprettVurderingLink.href,
            {
                behandlingUuid: opprettVurderingLink.requestPayload.behandlingUuid,
                perioder: nyVurderingsversjon.perioder,
                resultat: nyVurderingsversjon.resultat,
                tekst: nyVurderingsversjon.tekst,
                tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
                type: Vurderingstype.TO_OMSORGSPERSONER,
            },
            { cancelToken: httpCanceler.token }
        );
    }

    const lagreVurderingAvToOmsorgspersoner = (nyVurderingsversjon: Vurderingsversjon) => {
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
        <NyVurderingAvToOmsorgspersonerForm
            defaultValues={{
                [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                [FieldName.PERIODER]: resterendeVurderingsperioder,
                [FieldName.DOKUMENTER]: [],
            }}
            resterendeVurderingsperioder={resterendeVurderingsperioder}
            perioderSomKanVurderes={perioderSomKanVurderes}
            dokumenter={dokumenter}
            onSubmit={lagreVurderingAvToOmsorgspersoner}
        />
    );
};

export default NyVurderingAvToOmsorgspersonerController;
