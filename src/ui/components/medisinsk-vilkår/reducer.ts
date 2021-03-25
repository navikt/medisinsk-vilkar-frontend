import ActionType from './actionTypes';
import Step, { dokumentSteg } from '../../../types/Step';

interface State {
    isLoading: boolean;
    activeStep: Step;
    markedStep: Step;
    harGyldigSignatur: boolean;
    harRegistrertDiagnosekode: boolean;
}

interface Action {
    type: ActionType;
    harGyldigSignatur?: boolean;
    harRegistrertDiagnosekode?: boolean;
    step?: Step;
}

const medisinskVilkårReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.MARK_AND_ACTIVATE_STEP: {
            return {
                ...state,
                activeStep: action.step || dokumentSteg,
                markedStep: action.step,
                harGyldigSignatur: action.harGyldigSignatur,
                harRegistrertDiagnosekode: action.harRegistrertDiagnosekode,
                isLoading: false,
            };
        }
        case ActionType.ACTIVATE_STEP: {
            return {
                ...state,
                activeStep: action.step,
            };
        }
        case ActionType.ACTIVATE_DEFAULT_STEP: {
            return {
                ...state,
                activeStep: dokumentSteg,
                isLoading: false,
            };
        }
        case ActionType.NAVIGATE_TO_STEP: {
            return {
                ...state,
                activeStep: action.step,
                markedStep: action.step,
            };
        }
        case ActionType.UPDATE_STATUS: {
            return {
                ...state,
                harRegistrertDiagnosekode: action.harRegistrertDiagnosekode,
                harGyldigSignatur: action.harGyldigSignatur,
            };
        }
        default:
            return state;
    }
};

export default medisinskVilkårReducer;
