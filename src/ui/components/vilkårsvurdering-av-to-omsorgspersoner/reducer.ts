import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import Vurdering from '../../../types/Vurdering';
import { Period } from '../../../types/Period';
import ActionType from './actionTypes';

interface State {
    visVurderingDetails: boolean;
    isLoading: boolean;
    vurderingsoversikt: Vurderingsoversikt;
    valgtVurdering: Vurdering;
    perioderTilVurderingDefaultValue: Period[];
    vurdering: string;
}

interface Action {
    type: ActionType;
    vurderingsoversikt?: Vurderingsoversikt;
    vurdering?: Vurdering;
    perioderSomSkalVurderes?: Period[];
}

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const vilkårsvurderingReducer = (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.VIS_VURDERINGSOVERSIKT:
            const valgtVurdering = finnValgtVurdering(action.vurderingsoversikt.vurderinger, state.vurdering) || null;
            const perioderSomSkalVurderes = action.vurderingsoversikt?.perioderSomSkalVurderes || [];
            return {
                ...state,
                vurderingsoversikt: action.vurderingsoversikt,
                valgtVurdering,
                isLoading: false,
                perioderTilVurderingDefaultValue: perioderSomSkalVurderes,
                visVurderingDetails: true,
            };
        case ActionType.VIS_NY_VURDERING_FORM:
            return {
                ...state,
                valgtVurdering: null,
                perioderTilVurderingDefaultValue: action.perioderSomSkalVurderes || [],
                visVurderingDetails: true,
            };
        case ActionType.VELG_VURDERING:
            return {
                ...state,
                valgtVurdering: action.vurdering,
                visVurderingDetails: true,
            };
        default:
            return state;
    }
};

export default vilkårsvurderingReducer;
