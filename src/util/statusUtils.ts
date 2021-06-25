import StatusResponse from '../types/SykdomsstegStatusResponse';
import { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../types/Step';

type Steg = typeof dokumentSteg | typeof tilsynOgPleieSteg | typeof toOmsorgspersonerSteg;

export const finnNesteSteg = ({
    harUklassifiserteDokumenter,
    manglerDiagnosekode,
    manglerVurderingAvKontinuerligTilsynOgPleie,
    manglerVurderingAvToOmsorgspersoner,
    manglerGodkjentLegeerklæring,
}: StatusResponse): Steg => {
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

export const nesteStegErVurdering = (sykdomsstegStatus: StatusResponse): boolean => {
    const nesteSteg = finnNesteSteg(sykdomsstegStatus);
    return nesteSteg === tilsynOgPleieSteg || nesteSteg === toOmsorgspersonerSteg;
};
