import StatusResponse from '../types/SykdomsstegStatusResponse';
import { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../types/Steg';

export const finnNesteSteg = ({
    harUklassifiserteDokumenter,
    manglerGodkjentLegeerklæring,
    manglerDiagnosekode,
    manglerVurderingAvKontinuerligTilsynOgPleie,
    manglerVurderingAvToOmsorgspersoner,
}: StatusResponse) => {
    if (harUklassifiserteDokumenter || manglerGodkjentLegeerklæring || manglerDiagnosekode) {
        return dokumentSteg;
    }

    if (manglerVurderingAvKontinuerligTilsynOgPleie) {
        return tilsynOgPleieSteg;
    }

    if (manglerVurderingAvToOmsorgspersoner) {
        return toOmsorgspersonerSteg;
    }

    return null;
};
