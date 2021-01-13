import React, { useMemo } from 'react';
import Dokument from '../../../types/Dokument';
import { Period } from '../../../types/Period';
import RequestPayload from '../../../types/RequestPayload';
import Vurdering, { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import { fetchData, submitData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import VurderingAvTilsynsbehovForm, { FieldName } from '../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';

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
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const { endpoints, behandlingUuid } = React.useContext(ContainerContext);
    const fetchAborter = useMemo(() => new AbortController(), []);
    const { signal } = fetchAborter;

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        const opprettVurderingUrl = endpoints.opprettVurdering;
        return submitData<RequestPayload>(opprettVurderingUrl, {
            behandlingUuid,
            perioder: nyVurderingsversjon.perioder,
            resultat: nyVurderingsversjon.resultat,
            tekst: nyVurderingsversjon.tekst,
            tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
            type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
        });
    }

    function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        const endreVurderingUrl = endpoints.endreVurdering;
        return submitData<RequestPayload>(endreVurderingUrl, {
            behandlingUuid,
            perioder: nyVurderingsversjon.perioder,
            resultat: nyVurderingsversjon.resultat,
            tekst: nyVurderingsversjon.tekst,
            tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
            type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE,
            id: vurdering.id,
            versjon: vurdering.versjoner[0].versjon,
        });
    }

    function hentVurdering(): Promise<Vurdering> {
        const hentVurderingUrl = endpoints.hentVurdering;
        return fetchData(`${hentVurderingUrl}&sykdomVurderingId=${vurderingId}`, { signal });
    }

    function hentDataTilVurdering(): Promise<Dokument[]> {
        const dataTilVurderingUrl = endpoints.dataTilVurdering;
        return fetchData(dataTilVurderingUrl, { signal });
    }

    React.useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        if (vurderingId) {
            hentVurdering().then((vurderingResponse: Vurdering) => {
                if (isMounted) {
                    setVurdering(vurderingResponse);
                    setIsLoading(false);
                }
            });
        } else {
            setVurdering(null);
            // hentDataTilVurdering().then((dokumenterResponse: Dokument[]) => {
            if (isMounted) {
                // setDokumenter(dokumenterResponse);
                setIsLoading(false);
            }
            // });
        }

        return () => {
            isMounted = false;
            // fetchAborter.abort();
        };
    }, [vurderingId]);

    const lagreVurderingAvTilsynsbehov = (nyVurderingsversjon: Partial<Vurderingsversjon>) => {
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
        return <p>Laster</p>;
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
