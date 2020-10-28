// eslint-disable-next-line
import { Period } from '../Period';

export enum LegeerklæringKilde {
    SYKEHUSLEGE = 'SYKEHUSLEGE',
    SPESIALISTHELSETJENESTEN = 'SPESIALISTHELSETJENESTEN',
    FASTLEGE = 'FASTLEGE',
    ANNEN_YRKESGRUPPE = 'ANNEN_YRKESGRUPPE',
}

export interface Legeerklæring {
    diagnosekode: string;
    kilde: LegeerklæringKilde;
    fom: string;
    tom: string;
    innleggelsesperioder: Period[];
    identifikator: string;
}

export interface PeriodeMedTilsynOgPleie extends Period {
    begrunnelse: string;
    behovForToOmsorgspersoner: string;
    perioderMedUtvidetKontinuerligTilsynOgPleie?: PeriodeMedUtvidetTilsynOgPleie;
    begrunnelseUtvidet: string;
    harBehovForKontinuerligTilsynOgPleie: boolean;
    sammenhengMellomSykdomOgTilsyn: boolean;
    sammenhengMellomSykdomOgTilsynBegrunnelse: string;
}

export interface PeriodeMedTilsynOgPleieResponse {
    periode: Period;
    begrunnelse: string;
    årsaksammenheng: boolean;
    årsaksammenhengBegrunnelse: string;
}

export interface PeriodeMedUtvidetTilsynOgPleie extends Period {
    begrunnelse?: string;
}

export interface PeriodeMedUtvidetTilsynOgPleieResponse {
    begrunnelse: string;
    periode: Period;
}

export interface Pleiebehov {
    perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleie[];
}

export interface MedisinskVilkår {
    legeerklæring: Legeerklæring;
    pleiebehov: Pleiebehov;
}

interface Diagnosekode {
    key: string;
    value: string;
}

export interface TransformValues {
    diagnosekode?: Diagnosekode;
    innleggelsesperiode?: Period;
    legeerklaeringkilde: string;
    legeerklæringFom: string;
    perioderMedKontinuerligTilsynOgPleie?: PeriodeMedTilsynOgPleie[];
}
