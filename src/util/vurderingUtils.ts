import {
    FieldName as TilsynFieldName,
    NyVurderingAvTilsynsbehovFormState,
} from '../ui/components/ny-vurdering-av-tilsynsbehov-form/NyVurderingAvTilsynsbehovForm';
import {
    FieldName as ToOmsorgspersonerFieldName,
    NyVurderingAvToOmsorgspersonerFormState,
} from '../ui/components/ny-vurdering-av-to-omsorgspersoner-form/NyVurderingAvToOmsorgspersonerForm';
import Vurderingsresultat from '../types/Vurderingsresultat';
import { Period } from '../types/Period';
import Dokument from '../types/Dokument';
import { Vurderingsversjon } from '../types/Vurdering';
import { finnBenyttedeDokumenter } from './dokumentUtils';

export const lagTilsynsbehovVurdering = (
    formState: NyVurderingAvTilsynsbehovFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = formState[TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
        ? Vurderingsresultat.OPPFYLT
        : Vurderingsresultat.IKKE_OPPFYLT;
    const perioder = formState[TilsynFieldName.PERIODER].map((periodeWrapper) => {
        return new Period((periodeWrapper as any).period.fom, (periodeWrapper as any).period.tom);
    });
    const begrunnelse = formState[TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

    return {
        resultat,
        perioder,
        tekst: begrunnelse,
        dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
    };
};

export const lagToOmsorgspersonerVurdering = (
    formState: NyVurderingAvToOmsorgspersonerFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = formState[ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]
        ? Vurderingsresultat.OPPFYLT
        : Vurderingsresultat.IKKE_OPPFYLT;
    const perioder = formState[TilsynFieldName.PERIODER].map(
        (periodeWrapper) => new Period((periodeWrapper as any).period.fom, (periodeWrapper as any).period.tom)
    );
    const begrunnelse = formState[ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER];

    return {
        resultat,
        perioder,
        tekst: begrunnelse,
        dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
    };
};
