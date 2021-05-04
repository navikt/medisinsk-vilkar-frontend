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
import vurderingControllerReducer from './reducer';
import { postEndreVurdering, postEndreVurderingDryRun } from '../../../api/api';
import ContainerContext from '../../context/ContainerContext';
import { scrollUp } from '../../../util/viewUtils';

interface EndreVurderingControllerProps {
    endreVurderingLink: Link;
    dataTilVurderingUrl: string;
    onVurderingLagret: () => void;
    formRenderer: (dokumenter: Dokument[], onSubmit: (vurderingsversjon: Vurderingsversjon) => void) => React.ReactNode;
    vurderingstype: Vurderingstype;
    vurderingsid: string;
    vurderingsversjonId: string;
}

const EndreVurderingController = ({
    endreVurderingLink,
    dataTilVurderingUrl,
    onVurderingLagret,
    formRenderer,
    vurderingstype,
    vurderingsid,
    vurderingsversjonId,
}: EndreVurderingControllerProps) => {
    const { httpErrorHandler } = React.useContext(ContainerContext);

    const [state, dispatch] = React.useReducer(vurderingControllerReducer, {
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

    function endreVurdering(nyVurderingsversjon: Partial<Vurderingsversjon>) {
        dispatch({ type: ActionType.PENDING });
        return postEndreVurdering(
            endreVurderingLink.href,
            endreVurderingLink.requestPayload.behandlingUuid,
            vurderingsid,
            nyVurderingsversjon,
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
    ): Promise<PerioderMedEndringResponse> =>
        postEndreVurderingDryRun(
            endreVurderingLink.href,
            endreVurderingLink.requestPayload.behandlingUuid,
            vurderingsid,
            { ...nyVurderingsversjon, type: vurderingstype },
            httpErrorHandler,
            httpCanceler.token
        );

    const advarOmEksisterendeVurderinger = (
        nyVurderingsversjon: Vurderingsversjon,
        perioderMedEndringValue: PeriodeMedEndring[]
    ) => {
        dispatch({
            type: ActionType.ADVAR_OM_EKSISTERENDE_VURDERINGER,
            perioderMedEndring: perioderMedEndringValue,
            lagreVurderingFn: () => endreVurdering(nyVurderingsversjon),
        });
    };

    const beOmBekreftelseFørLagringHvisNødvendig = (nyVurderingsversjon: Vurderingsversjon) => {
        const nyVurderingsversjonMedVersjonId = { ...nyVurderingsversjon, versjon: vurderingsversjonId };
        sjekkForEksisterendeVurderinger(nyVurderingsversjonMedVersjonId).then((perioderMedEndringerResponse) => {
            const harOverlappendePerioder = perioderMedEndringerResponse.perioderMedEndringer.length > 0;
            if (harOverlappendePerioder) {
                advarOmEksisterendeVurderinger(
                    nyVurderingsversjonMedVersjonId,
                    perioderMedEndringerResponse.perioderMedEndringer
                );
            } else {
                endreVurdering(nyVurderingsversjonMedVersjonId);
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

export default EndreVurderingController;
