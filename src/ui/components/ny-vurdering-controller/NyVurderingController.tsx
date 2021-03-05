import React, { useMemo } from 'react';
import axios from 'axios';
import Dokument from '../../../types/Dokument';
import Link from '../../../types/Link';
import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingstype from '../../../types/Vurderingstype';
import { get } from '../../../util/httpUtils';
import PageContainer from '../page-container/PageContainer';
import { PeriodeMedEndring, PerioderMedEndringResponse } from '../../../types/PeriodeMedEndring';
import OverlappendePeriodeModal from '../overlappende-periode-modal/OverlappendePeriodeModal';
import ActionType from './actionTypes';
import nyVurderingControllerReducer from './reducer';
import { postNyVurdering, postNyVurderingDryRun } from '../../../api/api';
import ContainerContext from '../../context/ContainerContext';
import { scrollUp } from '../../../util/viewUtils';

interface NyVurderingController {
    opprettVurderingLink: Link;
    dataTilVurderingUrl: string;
    onVurderingLagret: () => void;
    formRenderer: (dokumenter: Dokument[], onSubmit: (vurderingsversjon: Vurderingsversjon) => void) => React.ReactNode;
    vurderingstype: Vurderingstype;
}

const NyVurderingController = ({
    opprettVurderingLink,
    dataTilVurderingUrl,
    onVurderingLagret,
    formRenderer,
    vurderingstype,
}: NyVurderingController) => {
    const { httpErrorHandler } = React.useContext(ContainerContext);

    const [state, dispatch] = React.useReducer(nyVurderingControllerReducer, {
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
            opprettVurderingLink.href,
            opprettVurderingLink.requestPayload.behandlingUuid,
            { ...nyVurderingsversjon, type: vurderingstype },
            httpErrorHandler,
            httpCanceler.token
        ).then(
            () => {
                onVurderingLagret();
                dispatch({ type: ActionType.VURDERING_LAGRET });
                scrollUp();
            },
            () => {
                dispatch({ type: ActionType.LAGRE_VURDERING_FEILET });
                scrollUp();
            }
        );
    }

    const sjekkForEksisterendeVurderinger = (
        nyVurderingsversjon: Vurderingsversjon
    ): Promise<PerioderMedEndringResponse> => {
        return postNyVurderingDryRun(
            opprettVurderingLink.href,
            opprettVurderingLink.requestPayload.behandlingUuid,
            { ...nyVurderingsversjon, type: vurderingstype },
            httpErrorHandler,
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

    const beOmBekreftelseFørLagringHvisNødvendig = (nyVurderingsversjon: Vurderingsversjon) => {
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
        return get(dataTilVurderingUrl, httpErrorHandler, { cancelToken: httpCanceler.token });
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
            {formRenderer(dokumenter, beOmBekreftelseFørLagringHvisNødvendig)}
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

export default NyVurderingController;
