import { Vurderingsversjon } from '../../../types/Vurdering';
import {
    FieldName as KontinuerligTilsynFieldName,
    VurderingAvTilsynsbehovFormState,
} from '../vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import {
    FieldName as ToOmsorgspersonerFieldName,
    VurderingAvToOmsorgspersonerFormState,
} from '../vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';

export function buildInitialFormStateForKontinuerligTilsynForEdit({
    tekst,
    resultat,
    perioder,
    dokumenter,
}: Vurderingsversjon): VurderingAvTilsynsbehovFormState {
    const dokumenterFraVurdering = dokumenter.map((dokument) => dokument.id);
    return {
        [KontinuerligTilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]: tekst,
        [KontinuerligTilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]:
            resultat === Vurderingsresultat.OPPFYLT,
        [KontinuerligTilsynFieldName.PERIODER]: perioder,
        [KontinuerligTilsynFieldName.DOKUMENTER]: dokumenterFraVurdering,
    };
}

export function buildInitialFormStateForToOmsorgspersonerForEdit({
    tekst,
    resultat,
    perioder,
    dokumenter,
}: Vurderingsversjon): VurderingAvToOmsorgspersonerFormState {
    const dokumenterFraVurdering = dokumenter.map((dokument) => dokument.id);
    return {
        [ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER]: tekst,
        [ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]: resultat === Vurderingsresultat.OPPFYLT,
        [ToOmsorgspersonerFieldName.PERIODER]: perioder,
        [ToOmsorgspersonerFieldName.DOKUMENTER]: dokumenterFraVurdering,
    };
}
