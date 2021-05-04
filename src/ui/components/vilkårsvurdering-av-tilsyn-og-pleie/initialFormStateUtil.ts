import { Vurderingsversjon } from '../../../types/Vurdering';
import {
    FieldName,
    VurderingAvTilsynsbehovFormState,
} from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import Vurderingsresultat from '../../../types/Vurderingsresultat';

export function buildInitialFormStateForEdit({
    tekst,
    resultat,
    perioder,
    dokumenter,
}: Vurderingsversjon): VurderingAvTilsynsbehovFormState {
    const dokumenterFraVurdering = dokumenter.map((dokument) => dokument.id);
    return {
        [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: tekst,
        [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: resultat === Vurderingsresultat.OPPFYLT,
        [FieldName.PERIODER]: perioder,
        [FieldName.DOKUMENTER]: dokumenterFraVurdering,
    };
}
