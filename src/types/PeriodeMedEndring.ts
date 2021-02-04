import { Period } from './Period';

export interface PerioderMedEndringResponse {
    perioderMedEndringer: PeriodeMedEndring[];
}

export interface PeriodeMedEndring {
    periode: Period;
    endrerVurderingSammeBehandling: boolean;
    endrerAnnenVurdering: boolean;
}
