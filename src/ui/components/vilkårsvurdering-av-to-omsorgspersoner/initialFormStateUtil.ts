import { Vurderingsversjon } from '../../../types/Vurdering';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import {
    FieldName,
    VurderingAvToOmsorgspersonerFormState,
} from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';

export function buildInitialFormStateForEdit({
    tekst,
    resultat,
    perioder,
    dokumenter,
}: Vurderingsversjon): VurderingAvToOmsorgspersonerFormState {
    const dokumenterFraVurdering = dokumenter.map((dokument) => dokument.id);
    return {
        [FieldName.VURDERING_AV_TO_OMSORGSPERSONER]: tekst,
        [FieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: resultat === Vurderingsresultat.OPPFYLT,
        [FieldName.PERIODER]: perioder,
        [FieldName.DOKUMENTER]: dokumenterFraVurdering,
    };
}
