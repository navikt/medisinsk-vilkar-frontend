import React, { useMemo } from 'react';
import axios from 'axios';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { Period } from '../../../types/Period';
import RequestPayload from '../../../types/RequestPayload';
import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import { fetchData, submitData } from '../../../util/httpUtils';
import NyVurderingAvTilsynsbehovForm, {
    FieldName,
} from '../ny-vurdering-av-tilsynsbehov-form/NyVurderingAvTilsynsbehovForm';
import PageContainer from '../page-container/PageContainer';

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

    return (
        <PageContainer isLoading={isLoading} hasError={hentDataTilVurderingHarFeilet} preventUnmount>
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
        </PageContainer>
    );
};

export default NyVurderingAvTilsynsbehovController;
