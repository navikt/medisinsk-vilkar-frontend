import Vurdering from '../types/Vurdering';
import { sortPeriodsByFomDate } from './periodUtils';
import { Period } from '../types/Period';

export interface Vurderingsperiode {
    periode: Period;
    vurdering: Vurdering;
}

export function sammenstillVurderingsperioder(vurderinger: Vurdering[]): Vurderingsperiode[] {
    return vurderinger
        .map((vurdering) => vurdering.perioder.map((periode) => ({ periode, vurdering })))
        .flat()
        .sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode))
        .reverse();
}
