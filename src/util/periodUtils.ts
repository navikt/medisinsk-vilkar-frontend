import { Period } from '../types/Period';

export const sortPeriodsByFomDate = (period1: Period, period2: Period) => {
    if (period1.startsBefore(period2)) {
        return 1;
    } else if (period2.startsBefore(period1)) {
        return -1;
    }
    return 0;
};
