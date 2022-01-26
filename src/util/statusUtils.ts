import StatusResponse from '../types/SykdomsstegStatusResponse';
import { dokumentSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../types/Step';
import SykdomsstegStatusSluttfaseResponse from '../types/SykdomsstegStatusSluttfaseResponse';

type Steg = typeof dokumentSteg | typeof tilsynOgPleieSteg | typeof toOmsorgspersonerSteg;

export const finnNesteSteg = (
    {
        kanLøseAksjonspunkt,
        harUklassifiserteDokumenter,
        manglerDiagnosekode,
        manglerVurderingAvKontinuerligTilsynOgPleie,
        manglerVurderingAvToOmsorgspersoner,
        manglerGodkjentLegeerklæring,
        nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
    }: StatusResponse,
    isOnMount?: boolean
): Steg => {
    if (harUklassifiserteDokumenter || manglerDiagnosekode || manglerGodkjentLegeerklæring) {
        return dokumentSteg;
    }

    if (manglerVurderingAvKontinuerligTilsynOgPleie || nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
        return tilsynOgPleieSteg;
    }

    if (manglerVurderingAvToOmsorgspersoner) {
        return toOmsorgspersonerSteg;
    }

    if (kanLøseAksjonspunkt && !isOnMount) {
        return tilsynOgPleieSteg;
    }

    return null;
};

export const finnNesteStegForLivetsSluttfase = (
    {
        kanLøseAksjonspunkt,
        harUklassifiserteDokumenter,
        manglerDiagnosekode,
        manglerVurderingAvKontinuerligTilsynOgPleie,
        manglerVurderingAvToOmsorgspersoner,
        manglerGodkjentLegeerklæring,
        nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
    }: SykdomsstegStatusSluttfaseResponse,
    isOnMount?: boolean
): Steg => {
    if (harUklassifiserteDokumenter || manglerGodkjentLegeerklæring) {
        return dokumentSteg;
    }

    if (manglerVurderingAvKontinuerligTilsynOgPleie || nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
        return tilsynOgPleieSteg;
    }

    if (manglerVurderingAvToOmsorgspersoner) {
        return toOmsorgspersonerSteg;
    }

    if (kanLøseAksjonspunkt && !isOnMount) {
        return tilsynOgPleieSteg;
    }

    return null;
};

export const nesteStegErVurdering = (sykdomsstegStatus: StatusResponse): boolean => {
    const nesteSteg = finnNesteSteg(sykdomsstegStatus);
    return nesteSteg === tilsynOgPleieSteg || nesteSteg === toOmsorgspersonerSteg;
};
