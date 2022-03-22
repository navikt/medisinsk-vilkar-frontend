import StatusResponse from '../types/SykdomsstegStatusResponse';
import { dokumentSteg, livetsSluttfaseSteg, tilsynOgPleieSteg, toOmsorgspersonerSteg } from '../types/Step';

type Steg = typeof dokumentSteg | typeof tilsynOgPleieSteg | typeof toOmsorgspersonerSteg;

export const finnNesteStegForPleiepenger = (
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
        manglerGodkjentLegeerklæring,
        manglerVurderingAvILivetsSluttfase,
        nyttDokumentHarIkkekontrollertEksisterendeVurderinger,
    }: StatusResponse,
    isOnMount?: boolean
): Steg => {
    if (harUklassifiserteDokumenter || manglerGodkjentLegeerklæring) {
        return dokumentSteg;
    }

    if (manglerVurderingAvILivetsSluttfase || nyttDokumentHarIkkekontrollertEksisterendeVurderinger) {
        return livetsSluttfaseSteg;
    }

    if (kanLøseAksjonspunkt && !isOnMount) {
        return livetsSluttfaseSteg;
    }

    return null;
};

export const nesteStegErVurderingForPleiepenger = (sykdomsstegStatus: StatusResponse): boolean => {
    const nesteSteg = finnNesteStegForPleiepenger(sykdomsstegStatus);
    return nesteSteg === tilsynOgPleieSteg || nesteSteg === toOmsorgspersonerSteg;
};

export const nesteStegErLivetssluttfase= (sykdomsstegStatus: StatusResponse): boolean => {
    const nesteSteg = finnNesteStegForLivetsSluttfase(sykdomsstegStatus);
    return nesteSteg === livetsSluttfaseSteg;
};
