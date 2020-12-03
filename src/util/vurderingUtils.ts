import Vurdering from '../types/Vurdering';
import {
    FieldName as TilsynFieldName,
    VurderingAvTilsynsbehovFormState,
} from '../ui/components/ny-vurdering-av-tilsynsbehov/NyVurderingAvTilsynsbehovForm';
import {
    FieldName as ToOmsorgspersonerFieldName,
    VurderingAvToOmsorgspersonerFormState,
} from '../ui/components/ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import Vurderingsresultat from '../types/Vurderingsresultat';
import { Period } from '../types/Period';

export const makeTilsynsbehovFormStateAsVurderingObject = (formState: VurderingAvTilsynsbehovFormState): Vurdering => {
    const resultat = formState[TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
        ? Vurderingsresultat.INNVILGET
        : Vurderingsresultat.AVSLÅTT;
    const perioder = formState[TilsynFieldName.PERIODER].map(({ fom, tom }) => new Period(fom, tom));
    const begrunnelse = formState[TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

    return {
        id: 'someID',
        resultat,
        perioder,
        begrunnelse,
    };
};

export const makeToOmsorgspersonerFormStateAsVurderingObject = (
    formState: VurderingAvToOmsorgspersonerFormState
): Vurdering => {
    const resultat = formState[ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]
        ? Vurderingsresultat.INNVILGET
        : Vurderingsresultat.AVSLÅTT;
    const perioder = formState[ToOmsorgspersonerFieldName.PERIODER].map(({ fom, tom }) => new Period(fom, tom));
    const begrunnelse = formState[ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER];

    return {
        id: 'someID',
        resultat,
        perioder,
        begrunnelse,
    };
};
