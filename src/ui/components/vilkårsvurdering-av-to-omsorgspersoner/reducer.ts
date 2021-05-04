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
    visRadForNyVurdering: boolean;
    vurderingsoversiktFeilet: boolean;
    erRedigeringsmodus: boolean;
}

interface Action {
    type: ActionType;
    vurderingsoversikt?: Vurderingsoversikt;
    valgtVurderingselement?: Vurderingselement;
    resterendeVurderingsperioder?: Period[];
}

const vilkårsvurderingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_VURDERINGSOVERSIKT: {
            const resterendeVurderingsperioder = action.vurderingsoversikt?.resterendeVurderingsperioder || [];
            return {
                ...state,
                vurderingsoversikt: action.vurderingsoversikt,
                isLoading: false,
                resterendeVurderingsperioderDefaultValue: resterendeVurderingsperioder,
                visVurderingDetails: false,
                visRadForNyVurdering: false,
                vurderingsoversiktFeilet: false,
                erRedigeringsmodus: false,
            };
        }
        case ActionType.VURDERINGSOVERSIKT_FEILET: {
            return {
                ...state,
                isLoading: false,
                vurderingsoversiktFeilet: true,
            };
        }
        case ActionType.VIS_NY_VURDERING_FORM:
            return {
                ...state,
                valgtVurderingselement: null,
                resterendeVurderingsperioderDefaultValue: action.resterendeVurderingsperioder || [],
                visVurderingDetails: true,
                visRadForNyVurdering: !action.resterendeVurderingsperioder,
            };
        case ActionType.VELG_VURDERINGSELEMENT:
            return {
                ...state,
                valgtVurderingselement: action.valgtVurderingselement,
                visVurderingDetails: true,
                erRedigeringsmodus: false,
            };
        case ActionType.PENDING:
            return {
                ...state,
                isLoading: true,
                vurderingsoversiktFeilet: false,
            };
        case ActionType.AVBRYT_FORM:
            return {
                ...state,
                visVurderingDetails: false,
                valgtVurderingselement: null,
                visRadForNyVurdering: false,
                erRedigeringsmodus: false,
            };
        case ActionType.SET_REDIGERINGSMODUS:
            return {
                ...state,
                visVurderingDetails: true,
                erRedigeringsmodus: true,
            };
        default:
            return state;
    }
};

export default vilkårsvurderingReducer;
