import { Period } from './Period';
import Tilsynsbehov from './Tilsynsbehov';

export enum SykdomFormValue {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
    VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE = 'vurderingKontinuerligTilsynOgPleie',
    VURDERING_TO_OMSORGSPERSONER = 'vurderingToOmsorgspersoner',
    PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE = 'perioderMedBehovForKontinuerligTilsynOgPleie',
    HAR_DOKUMENTASJON = 'harDokumentasjon',
    BEHOV_FOR_KONTINUERLIG_TILSYN = 'behovForKontinuerligTilsyn',
    BEHOV_FOR_TO_OMSORGSPERSONER = 'behovForToOmsorgspersoner',
    PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER = 'perioderMedBehovForToOmsorgspersoner',
}

interface SykdomFormState {
    [SykdomFormValue.INNLEGGELSESPERIODER]: Period[];
    [SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE]: string;
    [SykdomFormValue.VURDERING_TO_OMSORGSPERSONER]: string;
    [SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]: Period[];
    [SykdomFormValue.HAR_DOKUMENTASJON]: boolean;
    [SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN]: Tilsynsbehov;
    [SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER]: Tilsynsbehov;
    [SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER]: Period[];
}

export default SykdomFormState;
