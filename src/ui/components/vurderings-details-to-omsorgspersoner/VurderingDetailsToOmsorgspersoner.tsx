import React from 'react';
import mockedDokumentliste from '../../../mock/mockedDokumentliste';
import Dokument from '../../../types/Dokument';
import { Period } from '../../../types/Period';
import { ToOmsorgspersonerVurdering } from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import VurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';

interface VurderingDetailsProps {
    vurderingId: string | null;
    perioderTilVurdering: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

function lagreVurdering(vurdering: ToOmsorgspersonerVurdering) {
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

const VurderingDetailsToOmsorgspersoner = ({
    vurderingId,
    perioderTilVurdering,
    perioderSomKanVurderes,
    onVurderingLagret,
}: VurderingDetailsProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<ToOmsorgspersonerVurdering>(null);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    React.useEffect(() => {
        let isMounted = true;
        if (vurderingId !== null) {
            hentVurdering(vurderingId).then((vurderingResponse: ToOmsorgspersonerVurdering) => {
                if (isMounted) {
                    setVurdering(vurderingResponse);
                    setIsLoading(false);
                }
            });
        } else {
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

    const lagreVurderingAvToOmsorgspersoner = (nyVurdering: ToOmsorgspersonerVurdering) => {
        setIsLoading(true);
        lagreVurdering(nyVurdering).then(
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
        return <VurderingsdetaljerForToOmsorgspersoner vurdering={vurdering} />;
    }
    return (
        <VurderingAvToOmsorgspersonerForm
            defaultValues={{
                [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                [FieldName.PERIODER]: perioderTilVurdering,
                [FieldName.DOKUMENTER]: [],
            }}
            perioderSomSkalVurderes={perioderTilVurdering}
            perioderSomKanVurderes={perioderSomKanVurderes}
            dokumenter={alleDokumenter}
            onSubmit={lagreVurderingAvToOmsorgspersoner}
        />
    );
};

export default VurderingDetailsToOmsorgspersoner;
