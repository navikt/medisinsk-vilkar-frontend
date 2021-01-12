import React from 'react';
import Spinner from 'nav-frontend-spinner';
import VurderingAvTilsynsbehovForm, { FieldName } from '../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from '../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import { Period } from '../../../types/Period';
import Dokument from '../../../types/Dokument';
import Vurdering, { Vurderingsversjon } from '../../../types/Vurdering';
import { fetchData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import PageError from '../page-error/PageError';

interface VurderingDetailsProps {
    vurderingId: string | null;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>, vurdering: Vurdering) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({}), 1000);
    });
}

function hentVurdering(url: string, vurderingId: string): Promise<Vurdering> {
    return fetchData(`${url}?vurderingId=${vurderingId}`);
}

function hentDataTilVurdering(url: string): Promise<Dokument[]> {
    return fetchData(url);
}

const VurderingsdetaljerForKontinuerligTilsynOgPleie = ({
    vurderingId,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: VurderingDetailsProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<Vurdering>(null);
    const [hentVurderingHarFeilet, setHentVurderingHarFeilet] = React.useState<boolean>(false);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    const { endpoints } = React.useContext(ContainerContext);
    const vurderingUrl = endpoints.vurderingKontinuerligTilsynOgPleie;
    const dataTilVurderingUrl = endpoints.dataTilVurdering;

    const handleError = () => {
        setIsLoading(false);
        setHentVurderingHarFeilet(true);
    };

    React.useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setHentVurderingHarFeilet(false);
        if (vurderingId) {
            hentVurdering(vurderingUrl, vurderingId)
                .then((vurderingResponse: Vurdering) => {
                    if (isMounted) {
                        setVurdering(vurderingResponse);
                        setIsLoading(false);
                    }
                })
                .catch(handleError);
        } else {
            setVurdering(null);
            hentDataTilVurdering(dataTilVurderingUrl)
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
        };
    }, [vurderingId]);

    const lagreVurderingAvTilsynsbehov = (nyVurderingsversjon: Vurderingsversjon) => {
        setIsLoading(true);
        lagreVurdering(nyVurderingsversjon, vurdering).then(
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
