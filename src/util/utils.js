const harAktiviteterSomMåVurderesAvSaksbehandler = ({ aktiviteter }) => {
    return aktiviteter.some(({ måVurderesAvSaksbehandler }) => måVurderesAvSaksbehandler === true);
};

export const opptjeningerHarAktiviteterSomMåVurderesAvSaksbehandler = (opptjeninger) => {
    return opptjeninger.some(harAktiviteterSomMåVurderesAvSaksbehandler);
};
