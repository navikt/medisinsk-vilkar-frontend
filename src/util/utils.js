import moment from 'moment';

const harAktiviteterSomMåVurderesAvSaksbehandler = ({ aktiviteter }) => {
    return aktiviteter.some(({ måVurderesAvSaksbehandler }) => måVurderesAvSaksbehandler === true);
};

const opptjeningerHarAktiviteterSomMåVurderesAvSaksbehandler = (opptjeninger) => {
    return opptjeninger.some(harAktiviteterSomMåVurderesAvSaksbehandler);
};

const formatDate = (date) => moment(date, 'YYYY-MM-DD').format('DD.MM.YYYY');

const formatDateInterval = (from, to) => `${formatDate(from)} - ${formatDate(to)}`;

const isYear9999 = (date) => moment(date, 'YYYY-MM-DD').year() === 9999;

export default {
    opptjeningerHarAktiviteterSomMåVurderesAvSaksbehandler,
    formatDateInterval,
    formatDate,
    isYear9999,
};
