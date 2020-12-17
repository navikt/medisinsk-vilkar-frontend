import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { Period } from '../../../types/Period';
import ActionType from './actionTypes';
import Vurderingsperiode from '../../../types/Vurderingsperiode';

interface State {
    visVurderingDetails: boolean;
    isLoading: boolean;
    vurderingsoversikt: Vurderingsoversikt;
    valgtVurderingsperiode: Vurderingsperiode;
    perioderTilVurderingDefaultValue: Period[];
    vurdering: string;
}

interface Action {
    type: ActionType;
    vurderingsoversikt?: Vurderingsoversikt;
    vurderingsperiode?: Vurderingsperiode;
    perioderSomSkalVurderes?: Period[];
}

const finnValgtVurdering = (vurderingsperioder, vurderingId) => {
    return vurderingsperioder.find(({ id }) => vurderingId === id);
};

const vilkårsvurderingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_VURDERINGSOVERSIKT: {
            const valgtVurderingsperiode =
                finnValgtVurdering(action.vurderingsoversikt.vurderingsperioder, state.vurdering) || null;
            const perioderSomSkalVurderes = action.vurderingsoversikt?.perioderSomSkalVurderes || [];
            return {
                ...state,
                vurderingsoversikt: action.vurderingsoversikt,
                valgtVurderingsperiode,
                isLoading: false,
                perioderTilVurderingDefaultValue: perioderSomSkalVurderes,
                visVurderingDetails: true,
            };
        }
        case ActionType.VIS_NY_VURDERING_FORM:
            return {
                ...state,
                valgtVurderingsperiode: null,
                perioderTilVurderingDefaultValue: action.perioderSomSkalVurderes || [],
                visVurderingDetails: true,
            };
        case ActionType.VELG_VURDERINGSPERIODE:
            return {
                ...state,
                valgtVurderingsperiode: action.vurderingsperiode,
                visVurderingDetails: true,
            };
        default:
            return state;
    }
};

export default vilkårsvurderingReducer;
