import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { Period } from '../../../types/Period';
import ActionType from './actionTypes';
import Vurderingselement from '../../../types/Vurderingselement';

interface State {
    visVurderingDetails: boolean;
    isLoading: boolean;
    vurderingsoversikt: Vurderingsoversikt;
    valgtVurderingselement: Vurderingselement;
    resterendeVurderingsperioderDefaultValue: Period[];
    vurdering: string;
    visRadForNyVurdering: boolean;
}

interface Action {
    type: ActionType;
    vurderingsoversikt?: Vurderingsoversikt;
    vurderingselement?: Vurderingselement;
    resterendeVurderingsperioder?: Period[];
}

const finnvalgtVurderingselement = (vurderingselementer, vurderingId) => {
    return vurderingselementer.find(({ id }) => vurderingId === id);
};

const vilkårsvurderingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_VURDERINGSOVERSIKT: {
            const valgtVurderingselement =
                finnvalgtVurderingselement(action.vurderingsoversikt.vurderingselementer, state.vurdering) || null;
            const resterendeVurderingsperioder = action.vurderingsoversikt?.resterendeVurderingsperioder || [];
            return {
                ...state,
                vurderingsoversikt: action.vurderingsoversikt,
                valgtVurderingselement,
                isLoading: false,
                resterendeVurderingsperioderDefaultValue: resterendeVurderingsperioder,
                visVurderingDetails: false,
                visRadForNyVurdering: false,
            };
        }
        case ActionType.VIS_NY_VURDERING_FORM_FOR_PERIODE_TIL_VURDERING:
            return {
                ...state,
                valgtVurderingselement: null,
                resterendeVurderingsperioderDefaultValue: action.resterendeVurderingsperioder || [],
                visVurderingDetails: true,
            };
        case ActionType.VIS_NY_VURDERING_FORM_FOR_NY_PERIODE:
            return {
                ...state,
                valgtVurderingselement: null,
                resterendeVurderingsperioderDefaultValue: [],
                visVurderingDetails: true,
                visRadForNyVurdering: true,
            };
        case ActionType.VELG_VURDERINGSELEMENT:
            return {
                ...state,
                valgtVurderingselement: action.vurderingselement,
                visVurderingDetails: true,
            };
        default:
            return state;
    }
};

export default vilkårsvurderingReducer;
