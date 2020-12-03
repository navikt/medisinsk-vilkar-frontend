import { Period } from '../types/Period';
import { dateFromString, isSameOrBefore } from './dateUtils';

export const sortPeriodsByFomDate = (period1: Period, period2: Period, sortChronological?: boolean): number => {
    if (period1.startsBefore(period2)) {
        return sortChronological ? -1 : 1;
    }
    if (period2.startsBefore(period1)) {
        return sortChronological ? 1 : -1;
    }
    return 0;
};

const checkIfPeriodsAreEdgeToEdge = (period, nextPeriod) => {
    const dayAfterPeriod = dateFromString(period.tom).add(1, 'day');
    const startOfNextPeriod = dateFromString(nextPeriod.fom);
    return dayAfterPeriod.isSame(startOfNextPeriod);
};

export const slåSammenSammenhengendePerioder = (periods: Period[]): Period[] => {
    const sortedPeriods = periods.sort((p1, p2) => sortPeriodsByFomDate(p1, p2, true));
    const combinedPeriods: Period[] = [];

    const getFirstDate = (date1: string, date2: string) => {
        if (isSameOrBefore(date1, date2)) {
            return date1;
        }

        return date2;
    };

    const getLastDate = (date1: string, date2: string) => {
        if (isSameOrBefore(date1, date2)) {
            return date2;
        }

        return date1;
    };

    const addToListIfNotAdded = (period: Period) => {
        const previousPeriod = combinedPeriods[combinedPeriods.length - 1];
        if (!previousPeriod || !previousPeriod.includesDate(period.fom)) {
            combinedPeriods.push(period);
        }
    };

    sortedPeriods.forEach((period, index, array) => {
        const nextPeriod = array[index + 1];
        if (nextPeriod) {
            const hasOverlapWithNextPeriod = nextPeriod.includesDate(period.tom);
            const periodsAreEdgeToEdge = checkIfPeriodsAreEdgeToEdge(period, nextPeriod);

            if (hasOverlapWithNextPeriod) {
                const firstFom = getFirstDate(period.fom, nextPeriod.fom);
                const lastTom = getLastDate(period.tom, nextPeriod.tom);
                const combinedPeriod = new Period(firstFom, lastTom);
                combinedPeriods.push(combinedPeriod);
            } else if (periodsAreEdgeToEdge) {
                const combinedPeriod = new Period(period.fom, nextPeriod.tom);
                combinedPeriods.push(combinedPeriod);
            } else {
                addToListIfNotAdded(period);
            }
        } else {
            addToListIfNotAdded(period);
        }
    });
    return combinedPeriods;
};

export const finnHullIPeriodeTilVurdering = (perioderTilVurdering: Period[]) => {
    const hull: Period[] = [];
    const sortedPeriods = perioderTilVurdering.sort((p1, p2) => sortPeriodsByFomDate(p1, p2, true));

    sortedPeriods.forEach((period, index, array) => {
        const nextPeriod = array[index + 1];
        if (nextPeriod) {
            if (!checkIfPeriodsAreEdgeToEdge(period, nextPeriod) && !nextPeriod.includesDate(period.tom)) {
                const dayAfterPeriod = dateFromString(period.tom).add(1, 'day').format('YYYY-MM-DD');
                const dayBeforeStartOfNextPeriod = dateFromString(nextPeriod.fom)
                    .subtract(1, 'day')
                    .format('YYYY-MM-DD');
                const nyttHull = new Period(dayAfterPeriod, dayBeforeStartOfNextPeriod);
                hull.push(nyttHull);
            }
        }
    });
    return hull;
};
