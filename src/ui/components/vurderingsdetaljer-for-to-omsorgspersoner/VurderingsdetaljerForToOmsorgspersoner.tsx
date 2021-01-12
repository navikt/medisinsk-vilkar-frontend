import React from 'react';
import Dokument from '../../../types/Dokument';
import { Period } from '../../../types/Period';
import Vurdering, { Vurderingsversjon } from '../../../types/Vurdering';
import VurderingAvToOmsorgspersonerForm, {
    FieldName,
} from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import VurderingsoppsummeringForToOmsorgspersoner from '../vurderingsoppsummering-for-to-omsorgspersoner/VurderingsoppsummeringForToOmsorgspersoner';
import { fetchData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import PageError from '../page-error/PageError';

interface VurderingsdetaljerForToOmsorgspersonerProps {
    vurderingId: string | null;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

function lagreVurdering(nyVurderingsversjon: Vurderingsversjon, vurdering: Vurdering) {
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

    const { endpoints } = React.useContext(ContainerContext);
    const vurderingUrl = endpoints.vurderingToOmsorgspersoner;
    const dataTilVurderingUrl = endpoints.dataTilVurdering;

    const handleError = () => {
        setIsLoading(false);
        setHentVurderingHarFeilet(true);
    };

    React.useEffect(() => {
        setIsLoading(true);
        setHentVurderingHarFeilet(false);
        let isMounted = true;
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

    const lagreVurderingAvToOmsorgspersoner = (nyVurderingsversjon: Vurderingsversjon) => {
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
        return <p>Laster</p>;
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
