import React from 'react';
import VurderingAvTilsynsbehovForm, {
    FieldName,
} from './../ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import VurderingsoppsummeringForKontinuerligTilsynOgPleie from './../vurderingsoppsummering-for-kontinuerlig-tilsyn-og-pleie/VurderingsoppsummeringForKontinuerligTilsynOgPleie';
import { TilsynsbehovVurdering } from '../../../types/Vurdering';
import { Period } from '../../../types/Period';
import Dokument from '../../../types/Dokument';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import mockedDokumentliste from '../../../mock/mockedDokumentliste';

interface VurderingDetailsProps {
    vurderingId: string | null;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

function lagreVurdering() {
    return new Promise((resolve) => {
        setTimeout(() => resolve({}), 1000);
    });
}

function hentVurdering(vurderingsid: string) {
    return new Promise((resolve) => {
        setTimeout(
            () =>
                resolve({
                    id: vurderingsid,
                    perioder: [new Period('2020-01-01', '2020-01-15')],
                    resultat: Vurderingsresultat.INNVILGET,
                    begrunnelse: 'Fordi her er det behov',
                    dokumenter: mockedDokumentliste,
                }),
            1000
        );
    });
}

function hentNødvendigeDataForÅGjøreVurdering() {
    return new Promise<any>((resolve) => {
        setTimeout(
            () =>
                resolve({
                    dokumenter: mockedDokumentliste,
                }),
            1000
        );
    });
}

const VurderingsdetaljerForKontinuerligTilsynOgPleie = ({
    vurderingId,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: VurderingDetailsProps) => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<TilsynsbehovVurdering>(null);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    React.useEffect(() => {
        let isMounted = true;

        setIsLoading(true);

        if (vurderingId) {
            hentVurdering(vurderingId).then((vurderingResponse: TilsynsbehovVurdering) => {
                if (isMounted) {
                    setVurdering(vurderingResponse);
                    setIsLoading(false);
                }
            });
        } else {
            setVurdering(null);
            hentNødvendigeDataForÅGjøreVurdering().then((nødvendigeDataForÅGjøreVurdering) => {
                if (isMounted) {
                    setDokumenter(nødvendigeDataForÅGjøreVurdering.dokumenter);
                    setIsLoading(false);
                }
            });
        }

        return () => {
            isMounted = false;
        };
    }, [vurderingId]);

    const lagreVurderingAvTilsynsbehov = (nyVurdering: TilsynsbehovVurdering) => {
        setIsLoading(true);
        lagreVurdering().then(
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
        return <VurderingsoppsummeringForKontinuerligTilsynOgPleie vurdering={vurdering} />;
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
