import React, { useMemo } from 'react';
import axios from 'axios';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { Period } from '../../../types/Period';
import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import { fetchData, postNyVurdering, postNyVurderingDryRun } from '../../../util/httpUtils';
import NyVurderingAvTilsynsbehovForm, {
    FieldName,
} from '../ny-vurdering-av-tilsynsbehov-form/NyVurderingAvTilsynsbehovForm';
import PageContainer from '../page-container/PageContainer';
import { PeriodeMedEndring, PerioderMedEndringResponse } from '../../../types/PeriodeMedEndring';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';

interface NyVurderingAvTilsynsbehovControllerProps {
    opprettVurderingLink: Link;
    dataTilVurderingUrl: string;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

type LagreVurderingFunction = () => Promise<void>;

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

    const [visOverlappModal, setVisOverlappModal] = React.useState<boolean>(false);
    const [perioderMedEndring, setPerioderMedEndring] = React.useState<PeriodeMedEndring[]>([]);
    const [lagreVurderingFn, setLagreVurderingFn] = React.useState<LagreVurderingFunction>(null);

    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        setIsLoading(true);
        return postNyVurdering(
            opprettVurderingLink,
            { ...nyVurderingsversjon, type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE },
            httpCanceler.token
        ).then(
            () => {
                onVurderingLagret();
                setIsLoading(false);
            },
            () => {
                setIsLoading(false);
            }
        );
    }

    const sjekkForEksisterendeVurderinger = (
        nyVurderingsversjon: Vurderingsversjon
    ): Promise<PerioderMedEndringResponse> => {
        return postNyVurderingDryRun(
            opprettVurderingLink,
            { ...nyVurderingsversjon, type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE },
            httpCanceler.token
        );
    };

    const advarOmEksisterendeVurderinger = (perioderMedEndringValue: PeriodeMedEndring[]) => {
        setVisOverlappModal(true);
        setPerioderMedEndring(perioderMedEndringValue);
    };

    const lagreVurderingAvTilsynsbehov = (nyVurderingsversjon: Vurderingsversjon) => {
        sjekkForEksisterendeVurderinger(nyVurderingsversjon).then((perioderMedEndringerResponse) => {
            const harOverlappendePerioder = perioderMedEndringerResponse.perioderMedEndringer.length > 0;
            if (harOverlappendePerioder) {
                setLagreVurderingFn(() => lagreVurdering(nyVurderingsversjon));
                advarOmEksisterendeVurderinger(perioderMedEndringerResponse.perioderMedEndringer);
            } else {
                lagreVurdering(nyVurderingsversjon);
            }
        });
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
            <OverlappendePeriodeModal
                appElementId="app"
                perioderMedEndring={perioderMedEndring}
                onCancel={() => setVisOverlappModal(false)}
                onConfirm={() => {
                    lagreVurderingFn().then(() => {
                        setVisOverlappModal(false);
                    });
                }}
                isOpen={visOverlappModal}
            />
        </PageContainer>
    );
};

export default NyVurderingAvTilsynsbehovController;
