import FagsakYtelseType from '../constants/FagsakYtelseType';

// eslint-disable-next-line import/prefer-default-export
export const skalOppgiDiagnosekode = (fagsakYtelseType: FagsakYtelseType) =>
    ![FagsakYtelseType.OPPLÆRINGSPENGER, FagsakYtelseType.PLEIEPENGER_SLUTTFASE].includes(fagsakYtelseType);
