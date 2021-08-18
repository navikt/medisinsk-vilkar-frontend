import ActionType from './actionTypes';
import Step, { dokumentSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';

interface State {
    isLoading: boolean;
    hasError: boolean;
    activeStep: Step;
    markedStep: Step;
    sykdomsstegStatus: SykdomsstegStatusResponse;
}

interface Action {
    type: ActionType;
    step?: Step;
    sykdomsstegStatus?: SykdomsstegStatusResponse;
}

const medisinskVilkårReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.MARK_AND_ACTIVATE_STEP: {
            return {
                ...state,
                activeStep: action.step || dokumentSteg,
                markedStep: action.step,
                isLoading: false,
            };
        }
        case ActionType.ACTIVATE_STEP: {
            return {
                ...state,
                activeStep: action.step,
            };
        }
        case ActionType.ACTIVATE_STEP_AND_CLEAR_MARKING: {
            return {
                ...state,
                activeStep: action.step,
                markedStep: null,
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
                sykdomsstegStatus: action.sykdomsstegStatus,
            };
        }
        case ActionType.SHOW_ERROR: {
            return {
                ...state,
                hasError: true
            };
        }
        default:
            return state;
    }
};

export default medisinskVilkårReducer;
