import moment from 'moment';
import { Period } from '../types/Period';

function getPeriodAsListOfDays({ fom, tom }: Period) {
    const fomMoment = moment(fom);
    const tomMoment = moment(tom);

    const list = [];
    for (
        let currentDate = fomMoment;
        currentDate.isSameOrBefore(tomMoment);
        currentDate.add(1, 'days')
    ) {
        list.push(currentDate.format('YYYY-MM-DD'));
    }

    return list;
}

function getDaySequencesAsListOfPeriods(daySequences: string[][]): Period[] {
    return daySequences.map((daySequence) => {
        const firstDay = daySequence[0];
        const lastDay = daySequence[daySequence.length - 1];
        return {
            fom: firstDay,
            tom: lastDay,
        };
    });
}

export function intersectPeriods(basePeriod: Period, periods: Period[]) {
    const baseListOfDays = getPeriodAsListOfDays({
        fom: basePeriod.fom,
        tom: basePeriod.tom,
    });

    const listOfDaysToExclude = periods
        .map(({ fom, tom }) => getPeriodAsListOfDays({ fom, tom }))
        .flat();

    const daysToInclude = [];
    let index = 0;

    baseListOfDays.forEach((currentDay) => {
        const currentDayShouldBeIncluded = !listOfDaysToExclude.includes(currentDay);
        if (currentDayShouldBeIncluded) {
            if (Array.isArray(daysToInclude[index])) {
                daysToInclude[index].push(currentDay);
            } else {
                daysToInclude[index] = [currentDay];
            }
        } else {
            if (daysToInclude[index]) {
                index = index + 1;
            }
        }
    });

    return getDaySequencesAsListOfPeriods(daysToInclude);
}

export function isValidPeriod({ fom, tom }: Period) {
    return !isNaN(new Date(fom) as any) && !isNaN(new Date(tom) as any);
}
