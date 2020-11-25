import {
    Legeerklæring,
    PeriodeMedTilsynOgPleieResponse,
    PeriodeMedUtvidetTilsynOgPleieResponse,
} from './MedisinskVilkår';
import { Period } from '../Period';

export interface Søknadsperiode {
    fom: string;
    tom: string;
    status: string;
}

type Sykdom = Readonly<{
    periodeTilVurdering: Period;
    legeerklæringer: Legeerklæring[];
    perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse[];
    perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedUtvidetTilsynOgPleieResponse[];
    søknadsperioder: Søknadsperiode[];
}>;

export default Sykdom;
