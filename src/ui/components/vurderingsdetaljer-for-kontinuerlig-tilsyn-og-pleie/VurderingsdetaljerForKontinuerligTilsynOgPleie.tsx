import React, { useMemo } from 'react';
import Spinner from 'nav-frontend-spinner';
import VurderingAvTilsynsbehovForm, { FieldName } from '../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import { Period } from '../../../types/Period';
import Dokument from '../../../types/Dokument';
import RequestPayload from '../../../types/RequestPayload';
import Vurdering, { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import { fetchData, submitData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import PageError from '../page-error/PageError';

interface VurderingDetailsProps {
    vurderingId: string | null;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

const VurderingsdetaljerForKontinuerligTilsynOgPleie = ({
    vurderingId,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: VurderingDetailsProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<Vurdering>(null);
    const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const { endpoints, behandlingUuid } = React.useContext(ContainerContext);
    const fetchAborter = useMemo(() => new AbortController(), [vurderingId]);
    const { signal } = fetchAborter;

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        const opprettVurderingUrl = endpoints.opprettVurdering;
        return submitData<RequestPayload>(
            opprettVurderingUrl,
            {
                behandlingUuid,
                perioder: nyVurderingsversjon.perioder,
                resultat: nyVurderingsversjon.resultat,
                tekst: nyVurderingsversjon.tekst,
                tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
                type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
            },
            signal
        );
    }

    function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        const endreVurderingUrl = endpoints.endreVurdering;
        return submitData<RequestPayload>(
            endreVurderingUrl,
            {
                behandlingUuid,
                perioder: nyVurderingsversjon.perioder,
                resultat: nyVurderingsversjon.resultat,
                tekst: nyVurderingsversjon.tekst,
                tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
                type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
                id: vurdering.id,
                versjon: vurdering.versjoner[0].versjon,
            },
            signal
        );
    }

    function hentVurdering(): Promise<Vurdering> {
        const hentVurderingUrl = endpoints.hentVurdering;
        return fetchData(`${hentVurderingUrl}&sykdomVurderingId=${vurderingId}`, { signal });
    }

    function hentDataTilVurdering(): Promise<Dokument[]> {
        const dataTilVurderingUrl = endpoints.dataTilVurdering;
        if (!dataTilVurderingUrl) {
            return new Promise((resolve) => resolve([]));
        }
        return fetchData(dataTilVurderingUrl, { signal });
    }

    const handleError = () => {
        setIsLoading(false);
        setHentVurderingHarFeilet(true);
    };

    React.useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setHentVurderingHarFeilet(false);
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

    if (isLoading) {
        return <Spinner />;
    }
    if (hentVurderingHarFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }
    if (vurdering !== null) {
        return (
            <VurderingsoppsummeringForKontinuerligTilsynOgPleie alleDokumenter={alleDokumenter} vurdering={vurdering} />
        );
    }

    return (
        <VurderingAvTilsynsbehovForm
            defaultValues={{
                [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: '',
                [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: undefined,
                [FieldName.PERIODER]: resterendeVurderingsperioder,
                [FieldName.DOKUMENTER]: [],
            }}
            resterendeVurderingsperioder={resterendeVurderingsperioder}
            perioderSomKanVurderes={perioderSomKanVurderes}
            dokumenter={alleDokumenter}
            onSubmit={lagreVurderingAvTilsynsbehov}
        />
    );
};

export default VurderingsdetaljerForKontinuerligTilsynOgPleie;
