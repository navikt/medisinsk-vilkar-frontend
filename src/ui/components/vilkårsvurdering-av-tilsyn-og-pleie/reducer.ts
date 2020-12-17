import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import { Period } from '../../../types/Period';
import ActionType from './actionTypes';
import Vurderingselement from '../../../types/Vurderingselement';

interface State {
    visVurderingDetails: boolean;
    isLoading: boolean;
    vurderingsoversikt: Vurderingsoversikt;
    valgtVurderingselement: Vurderingselement;
    perioderTilVurderingDefaultValue: Period[];
    vurdering: string;
}

interface Action {
    type: ActionType;
    vurderingsoversikt?: Vurderingsoversikt;
    vurderingselement?: Vurderingselement;
    perioderSomSkalVurderes?: Period[];
}

const finnvalgtVurderingselement = (vurderingselementer, vurderingId) => {
    return vurderingselementer.find(({ id }) => vurderingId === id);
};

const vilkårsvurderingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_VURDERINGSOVERSIKT: {
            const valgtVurderingselement =
                finnvalgtVurderingselement(action.vurderingsoversikt.vurderingselementer, state.vurdering) || null;
            const perioderSomSkalVurderes = action.vurderingsoversikt?.perioderSomSkalVurderes || [];
            return {
                ...state,
                vurderingsoversikt: action.vurderingsoversikt,
                valgtVurderingselement,
                isLoading: false,
                perioderTilVurderingDefaultValue: perioderSomSkalVurderes,
                visVurderingDetails: true,
            };
        }
        case ActionType.VIS_NY_VURDERING_FORM:
            return {
                ...state,
                valgtVurderingselement: null,
                perioderTilVurderingDefaultValue: action.perioderSomSkalVurderes || [],
                visVurderingDetails: true,
            };
        case ActionType.VELG_VURDERING:
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
