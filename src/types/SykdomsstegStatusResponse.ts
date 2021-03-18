interface SykdomsstegStatusResponse {
    kanLøseAksjonspunkt: boolean;
    harUklassifiserteDokumenter: boolean;
    manglerDiagnosekode: boolean;
    manglerGodkjentLegeerklæring: boolean;
    manglerVurderingAvKontinuerligTilsynOgPleie: boolean;
    manglerVurderingAvToOmsorgspersoner: boolean;
}

export default SykdomsstegStatusResponse;
