interface SykdomsstegStatusSluttfaseResponse {
    kanLøseAksjonspunkt: boolean;
    harDataSomIkkeHarBlittTattMedIBehandling: boolean;
    harUklassifiserteDokumenter: boolean;
    manglerGodkjentLegeerklæring: boolean;
    manglerVurderingAvKontinuerligTilsynOgPleie: boolean;
    manglerVurderingAvToOmsorgspersoner: boolean;
    nyttDokumentHarIkkekontrollertEksisterendeVurderinger: boolean;
    manglerVurderingAvILivetsSluttfase: boolean;
}

export default SykdomsstegStatusSluttfaseResponse;
