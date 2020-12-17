import React from 'react';
import mockedDokumentliste from '../../../mock/mockedDokumentliste';
import { toSøkereMedTilsynsbehovVurderingerMock } from '../../../mock/mockedTilsynsbehovVurderinger';
import Dokument from '../../../types/Dokument';
import { Period } from '../../../types/Period';
import { ToOmsorgspersonerVurdering } from '../../../types/Vurdering';
import VurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';

interface VurderingsdetaljerForToOmsorgspersonerProps {
    vurderingId: string | null;
    perioderSomSkalVurderes: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

function lagreVurdering(vurdering: ToOmsorgspersonerVurdering) {
    return new Promise((resolve) => {
        setTimeout(() => resolve({}), 1000);
    });
}

function hentVurdering(vurderingsid: string): Promise<ToOmsorgspersonerVurdering> {
    return new Promise((resolve) => {
        setTimeout(() => {
            const vurdering = toSøkereMedTilsynsbehovVurderingerMock.find(
                (vurderingMock) => vurderingMock.id === vurderingsid
            );
            resolve(vurdering);
        }, 1000);
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

const VurderingsdetaljerToOmsorgspersoner = ({
    vurderingId,
    perioderSomSkalVurderes,
    perioderSomKanVurderes,
    onVurderingLagret,
}: VurderingsdetaljerForToOmsorgspersonerProps): JSX.Element => {
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [vurdering, setVurdering] = React.useState<ToOmsorgspersonerVurdering>(null);
    const [alleDokumenter, setDokumenter] = React.useState<Dokument[]>([]);

    React.useEffect(() => {
        setIsLoading(true);
        let isMounted = true;
        if (vurderingId) {
            hentVurdering(vurderingId).then((vurderingResponse: ToOmsorgspersonerVurdering) => {
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
        return <VurderingsoppsummeringForToOmsorgspersoner dokumenter={alleDokumenter} vurdering={vurdering} />;
    }
    return (
        <VurderingAvToOmsorgspersonerForm
            defaultValues={{
                [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: '',
                [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: undefined,
                [FieldName.PERIODER]: perioderSomSkalVurderes,
                [FieldName.DOKUMENTER]: [],
            }}
            perioderSomSkalVurderes={perioderSomSkalVurderes}
            perioderSomKanVurderes={perioderSomKanVurderes}
            dokumenter={alleDokumenter}
            onSubmit={lagreVurderingAvToOmsorgspersoner}
        />
    );
};

export default VurderingsdetaljerToOmsorgspersoner;
