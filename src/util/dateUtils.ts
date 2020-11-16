import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Period } from '../types/Period';

dayjs.extend(utc);

function isSameOrBefore(date, otherDate) {
    const dateInQuestion = dayjs(date);
    return dateInQuestion.isBefore(otherDate) || dateInQuestion.isSame(otherDate);
}

export function dateFromString(dateString: string) {
    return dayjs(dateString).utc(true);
}

export function getPeriodAsListOfDays(period: Period) {
    const fom = dateFromString(period.fom);
    const tom = dateFromString(period.tom);

    const list = [];
    for (let currentDate = fom; isSameOrBefore(currentDate, tom); currentDate = currentDate.add(1, 'day')) {
        list.push(currentDate.format('YYYY-MM-DD'));
    }

    return list;
}

function getDaySequencesAsListOfPeriods(daySequences: string[][]): Period[] {
    return daySequences.map((daySequence) => {
        const firstDay = daySequence[0];
        const lastDay = daySequence[daySequence.length - 1];
        return new Period(firstDay, lastDay);
    });
}

export function getPeriodDifference(basePeriod: Period, periods: Period[]) {
    const baseListOfDays = getPeriodAsListOfDays(basePeriod);

    const listOfDaysToExclude = periods.map((period) => getPeriodAsListOfDays(period)).flat();

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

export function isValidDate(date: any) {
    return !isNaN(new Date(date) as any);
}

export function isValidPeriod({ fom, tom }: Period) {
    return isValidDate(fom) && isValidDate(tom);
}
