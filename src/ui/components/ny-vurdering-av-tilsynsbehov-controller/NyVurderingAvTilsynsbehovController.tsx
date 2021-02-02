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
import ActionType from './actionTypes';
import nyVurderingAvTilsynsbehovReducer from './reducer';

interface NyVurderingAvTilsynsbehovControllerProps {
    opprettVurderingLink: Link;
    dataTilVurderingUrl: string;
    resterendeVurderingsperioder: Period[];
    perioderSomKanVurderes: Period[];
    onVurderingLagret: () => void;
}

const NyVurderingAvTilsynsbehovController = ({
    opprettVurderingLink,
    dataTilVurderingUrl,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onVurderingLagret,
}: NyVurderingAvTilsynsbehovControllerProps) => {
    const [state, dispatch] = React.useReducer(nyVurderingAvTilsynsbehovReducer, {
        isLoading: true,
        dokumenter: [],
        hentDataTilVurderingHarFeilet: false,
        perioderMedEndring: [],
        lagreVurderingFn: null,
        overlappendePeriodeModalOpen: false,
    });

    const {
        isLoading,
        dokumenter,
        hentDataTilVurderingHarFeilet,
        perioderMedEndring,
        lagreVurderingFn,
        overlappendePeriodeModalOpen,
    } = state;
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    function lagreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        dispatch({ type: ActionType.PENDING });
        return postNyVurdering(
            opprettVurderingLink,
            { ...nyVurderingsversjon, type: Vurderingstype.KONTINUERLIG_TILSYN_OG_PLEIE },
            httpCanceler.token
        ).then(
            () => {
                onVurderingLagret();
                dispatch({ type: ActionType.VURDERING_LAGRET });
            },
            () => {
                dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
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

    const advarOmEksisterendeVurderinger = (
        nyVurderingsversjon: Vurderingsversjon,
        perioderMedEndringValue: PeriodeMedEndring[]
    ) => {
        dispatch({
            type: ActionType.ADVAR_OM_EKSISTERENDE_VURDERINGER,
            perioderMedEndring: perioderMedEndringValue,
            lagreVurderingFn: () => lagreVurdering(nyVurderingsversjon),
        });
    };

    const lagreVurderingAvTilsynsbehov = (nyVurderingsversjon: Vurderingsversjon) => {
        sjekkForEksisterendeVurderinger(nyVurderingsversjon).then((perioderMedEndringerResponse) => {
            const harOverlappendePerioder = perioderMedEndringerResponse.perioderMedEndringer.length > 0;
            if (harOverlappendePerioder) {
                advarOmEksisterendeVurderinger(nyVurderingsversjon, perioderMedEndringerResponse.perioderMedEndringer);
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

    const handleHentDataTilVurderingError = () => {
        dispatch({ type: ActionType.HENT_DATA_TIL_VURDERING_HAR_FEILET });
    };

    React.useEffect(() => {
        let isMounted = true;
        dispatch({ type: ActionType.HENT_DATA_TIL_VURDERING });
        hentDataTilVurdering()
            .then((dokumenterResponse: Dokument[]) => {
                if (isMounted) {
                    dispatch({ type: ActionType.HENTET_DATA_TIL_VURDERING, dokumenter: dokumenterResponse });
                }
            })
            .catch(handleHentDataTilVurderingError);

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
                onCancel={() => dispatch({ type: ActionType.LAGRING_AV_VURDERING_AVBRUTT })}
                onConfirm={() => {
                    lagreVurderingFn().then(() => {
                        dispatch({ type: ActionType.VURDERING_LAGRET, perioderMedEndring });
                    });
                }}
                isOpen={overlappendePeriodeModalOpen}
                isLoading={isLoading}
            />
        </PageContainer>
    );
};

export default NyVurderingAvTilsynsbehovController;
