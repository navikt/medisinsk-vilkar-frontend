import React, { useMemo } from 'react';
import VurderingAvTilsynsbehovForm, { FieldName } from '../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import { Period } from '../../../types/Period';
import Dokument from '../../../types/Dokument';
import Vurdering, { Vurderingsversjon } from '../../../types/Vurdering';
import { fetchData, submitData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import Links from '../../../types/Links';
import RequestPayload from '../../../types/RequestPayload';
import VurderingType from '../../../types/VurderingType';

interface VurderingDetailsProps {
    vurderingId: string | null;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
    vurderingsoversiktLinks: Links[];
    vurderingLinks: Links[];
}

const VurderingsdetaljerForKontinuerligTilsynOgPleie = ({
    vurderingId,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
    vurderingsoversiktLinks,
    vurderingLinks,
}: VurderingDetailsProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<Vurdering>(null);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const { endpoints } = React.useContext(ContainerContext);
    const dataTilVurderingUrl = endpoints.dataTilVurdering;
    const fetchAborter = useMemo(() => new AbortController(), []);
    const { signal } = fetchAborter;

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        const lagreVurderingLink = vurderingsoversiktLinks.find((link) => link.rel === 'sykdom-vurdering-opprettelse');
        return submitData<RequestPayload>(lagreVurderingLink.href, lagreVurderingLink.type, {
            behandlingUuid: lagreVurderingLink.requestPayload.behandlingUuid,
            perioder: nyVurderingsversjon.perioder,
            resultat: nyVurderingsversjon.resultat,
            tekst: nyVurderingsversjon.tekst,
            tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
            type: VurderingType.KONTINUERLIG_TILSYN_OG_PLEIE,
        });
    }

    function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        const endreVurderingLink = vurderingsoversiktLinks.find((link) => link.rel === 'sykdom-vurdering-endring');
        return submitData<RequestPayload>(endreVurderingLink.href, endreVurderingLink.type, {
            behandlingUuid: endreVurderingLink.requestPayload.behandlingUuid,
            perioder: nyVurderingsversjon.perioder,
            resultat: nyVurderingsversjon.resultat,
            tekst: nyVurderingsversjon.tekst,
            tilknyttedeDokumenter: nyVurderingsversjon.dokumenter,
            type: VurderingType.KONTINUERLIG_TILSYN_OG_PLEIE,
            id: vurdering.id,
            versjon: vurdering.versjoner[0].versjon,
        });
    }

    function hentVurdering(): Promise<Vurdering> {
        const hentVurderingLink = vurderingLinks.find((links) => links.rel === 'sykdom-vurdering');
        return fetchData(hentVurderingLink.href, { signal });
    }

    function hentDataTilVurdering(url: string): Promise<Dokument[]> {
        return fetchData(url, { signal });
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
            // hentDataTilVurdering(dataTilVurderingUrl).then((dokumenterResponse: Dokument[]) => {
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
