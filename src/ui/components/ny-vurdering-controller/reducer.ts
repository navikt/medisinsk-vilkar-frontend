import ActionType from './actionTypes';
import Dokument from '../../../types/Dokument';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';

type LagreVurderingFunction = () => Promise<void>;

interface State {
    isLoading: boolean;
    dokumenter: Dokument[];
    hentDataTilVurderingHarFeilet: boolean;
    perioderMedEndring: PeriodeMedEndring[];
    lagreVurderingFn: LagreVurderingFunction;
    overlappendePeriodeModalOpen: boolean;
}

interface Action {
    type: ActionType;
    perioderMedEndring?: PeriodeMedEndring[];
    lagreVurderingFn?: LagreVurderingFunction;
    dokumenter?: Dokument[];
}

const nyVurderingControllerReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.PENDING:
            return {
                ...state,
                isLoading: true,
            };
        case ActionType.VURDERING_LAGRET:
            return {
                ...state,
                isLoading: false,
                perioderMedEndring: null,
                overlappendePeriodeModalOpen: false,
            };
        case ActionType.LAGRE_VURDERING_FEILET:
            return {
                ...state,
                isLoading: false,
            };
        case ActionType.LAGRING_AV_VURDERING_AVBRUTT:
            return {
                ...state,
                overlappendePeriodeModalOpen: false,
            };
        case ActionType.ADVAR_OM_EKSISTERENDE_VURDERINGER:
            return {
                ...state,
                overlappendePeriodeModalOpen: true,
                perioderMedEndring: action.perioderMedEndring,
                lagreVurderingFn: action.lagreVurderingFn,
            };
        case ActionType.HENT_DATA_TIL_VURDERING:
            return {
                ...state,
                isLoading: true,
                hentDataTilVurderingHarFeilet: false,
            };
        case ActionType.HENTET_DATA_TIL_VURDERING:
            return {
                ...state,
                dokumenter: action.dokumenter,
                isLoading: false,
            };
        case ActionType.HENT_DATA_TIL_VURDERING_HAR_FEILET:
            return {
                ...state,
                isLoading: false,
                hentDataTilVurderingHarFeilet: true,
            };
        default:
            return state;
    }
};

export default nyVurderingControllerReducer;
