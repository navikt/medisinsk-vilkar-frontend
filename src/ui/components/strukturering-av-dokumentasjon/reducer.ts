import Dokument from '../../../types/Dokument';
import ActionType from './actionTypes';
import { Dokumentoversikt } from '../../../types/Dokumentoversikt';

interface State {
    visDokumentDetails: boolean;
    isLoading: boolean;
    dokumentoversikt: Dokumentoversikt;
    valgtDokument: Dokument;
    dokument: string;
    dokumentoversiktFeilet: boolean;
}

interface Action {
    type: ActionType;
    dokumentoversikt?: Dokumentoversikt;
    valgtDokument?: Dokument;
}

const finnValgtDokument = (dokumenter, dokumentId) => {
    return dokumenter.find(({ id }) => dokumentId === id);
};

const vilkårsdokumentReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_DOKUMENTOVERSIKT: {
            const { alleDokumenter } = action.dokumentoversikt;
            const valgtDokument = finnValgtDokument(alleDokumenter || [], state.dokument) || null;
            return {
                ...state,
                dokumentoversikt: action.dokumentoversikt,
                valgtDokument,
                isLoading: false,
                visDokumentDetails: false,
                dokumentoversiktFeilet: false,
            };
        }
        case ActionType.DOKUMENTOVERSIKT_FEILET: {
            return {
                ...state,
                isLoading: false,
                dokumentoversiktFeilet: true,
            };
        }
        case ActionType.VELG_DOKUMENT:
            return {
                ...state,
                valgtDokument: action.valgtDokument,
                visDokumentDetails: true,
            };
        case ActionType.PENDING:
            return {
                ...state,
                isLoading: true,
                dokumentoversiktFeilet: false,
            };
        default:
            return state;
    }
};

export default vilkårsdokumentReducer;
