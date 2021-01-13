import Spinner from 'nav-frontend-spinner';
import React, { useMemo } from 'react';
import mockedDokumentliste from '../../../../mock/mocked-data/mockedDokumentliste';
import Dokument from '../../../types/Dokument';
import { Period } from '../../../types/Period';
import RequestPayload from '../../../types/RequestPayload';
import Vurdering, { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import { fetchData, submitData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import VurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import PageError from '../page-error/PageError';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';

interface VurderingsdetaljerForToOmsorgspersonerProps {
    vurderingId: string | null;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

const VurderingsdetaljerToOmsorgspersoner = ({
    vurderingId,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: VurderingsdetaljerForToOmsorgspersonerProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<Vurdering>(null);
    const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const { endpoints, behandlingUuid } = React.useContext(ContainerContext);
    const fetchAborter = useMemo(() => new AbortController(), [vurderingId]);
    const { signal } = fetchAborter;

    const handleError = () => {
        setIsLoading(false);
        setHentVurderingHarFeilet(true);
    };

    function lagreVurdering(nyVurderingsversjon: Vurderingsversjon) {
        const opprettVurderingUrl = endpoints.opprettVurdering;
        return submitData<RequestPayload>(
            opprettVurderingUrl,
            {
                behandlingUuid,
                perioder: nyVurderingsversjon.perioder,
                resultat: nyVurderingsversjon.resultat,
                tekst: nyVurderingsversjon.tekst,
                tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
                type: Vurderingstype.TO_OMSORGSPERSONER,
            },
            signal
        );
    }

    function hentVurdering(): Promise<Vurdering> {
        const hentVurderingUrl = endpoints.hentVurdering;
        return fetchData(`${hentVurderingUrl}?sykdomVurderingId=${vurderingId}`, { signal });
    }

    function hentDataTilVurdering(): Promise<Dokument[]> {
        const dataTilVurderingUrl = endpoints.dataTilVurdering;
        if (!dataTilVurderingUrl) {
            return new Promise((resolve) => resolve(mockedDokumentliste));
        }
        return fetchData(dataTilVurderingUrl, { signal });
    }

    React.useEffect(() => {
        setIsLoading(true);
        setHentVurderingHarFeilet(false);
        let isMounted = true;
        if (vurderingId) {
            hentVurdering()
                .then((vurderingResponse: Vurdering) => {
                    if (isMounted) {
                        setVurdering(vurderingResponse);
                        setIsLoading(false);
                    }
                })
                .catch(handleError);
        } else {
            setVurdering(null);
            hentDataTilVurdering()
                .then((dokumenterResponse: Dokument[]) => {
                    if (isMounted) {
                        setDokumenter(dokumenterResponse);
                        setIsLoading(false);
                    }
                })
                // todo: should this situation be handled differently?
                .catch(handleError);
        }

        return () => {
            isMounted = false;
            fetchAborter.abort();
        };
    }, [vurderingId]);

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

    if (isLoading) {
        return <Spinner />;
    }
    if (hentVurderingHarFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }
    if (vurdering !== null) {
        return <VurderingsoppsummeringForToOmsorgspersoner alleDokumenter={alleDokumenter} vurdering={vurdering} />;
    }
    return (
        <VurderingAvToOmsorgspersonerForm
            defaultValues={{
                [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                [FieldName.PERIODER]: resterendeVurderingsperioder,
                [FieldName.DOKUMENTER]: [],
            }}
            resterendeVurderingsperioder={resterendeVurderingsperioder}
            perioderSomKanVurderes={perioderSomKanVurderes}
            dokumenter={alleDokumenter}
            onSubmit={lagreVurderingAvToOmsorgspersoner}
        />
    );
};

export default VurderingsdetaljerToOmsorgspersoner;
