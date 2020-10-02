const harAktiviteterSomMåVurderesAvSaksbehandler = ({ aktiviteter }) => {
    return aktiviteter.some(({ måVurderesAvSaksbehandler }) => måVurderesAvSaksbehandler === true);
};

const opptjeningerHarAktiviteterSomMåVurderesAvSaksbehandler = (opptjeninger) => {
    return opptjeninger.some(harAktiviteterSomMåVurderesAvSaksbehandler);
};

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('no-NB');

const formatDateInterval = (from, to) => `${formatDate(from)} - ${formatDate(to)}`;

const isYear9999 = (dateString) => new Date(dateString).getFullYear() === 9999;

export default {
    opptjeningerHarAktiviteterSomMåVurderesAvSaksbehandler,
    formatDateInterval,
    formatDate,
    isYear9999,
};
