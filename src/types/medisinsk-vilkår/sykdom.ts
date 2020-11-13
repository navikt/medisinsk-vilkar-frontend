import {
    Legeerklæring,
    PeriodeMedTilsynOgPleieResponse,
    PeriodeMedUtvidetTilsynOgPleieResponse,
} from './MedisinskVilkår';
import { Period } from '../Period';

type Sykdom = Readonly<{
    periodeTilVurdering: Period;
    legeerklæringer: Legeerklæring[];
    perioderMedKontinuerligTilsynOgPleie: PeriodeMedTilsynOgPleieResponse[];
    perioderMedUtvidetKontinuerligTilsynOgPleie: PeriodeMedUtvidetTilsynOgPleieResponse[];
}>;

export default Sykdom;
