import StatusResponse from '../types/SykdomsstegStatusResponse';
import { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../types/Step';

export const finnNesteSteg = ({
    harUklassifiserteDokumenter,
    manglerDiagnosekode,
    manglerVurderingAvKontinuerligTilsynOgPleie,
    manglerVurderingAvToOmsorgspersoner,
    manglerGodkjentLegeerklæring,
}: StatusResponse) => {
    if (harUklassifiserteDokumenter || manglerDiagnosekode || manglerGodkjentLegeerklæring) {
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
