import { Period } from '@navikt/k9-period-utils';

export const prettifyPeriodList = (perioder: Period[]) =>
    perioder.map((periode) => periode.prettifyPeriod()).join(', ');
