import { Periode } from '../types/medisinsk-vilkår/MedisinskVilkår';
import moment from 'moment';

function getPeriodAsListOfDays({ fom, tom }: Periode) {
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

export function intersectPeriods(basePeriod: Periode, period2: Periode[]) {
    const baseListOfDays = getPeriodAsListOfDays({
        fom: basePeriod.fom,
        tom: basePeriod.tom,
    });

    const listOfDaysToExclude = period2
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

    return daysToInclude;
}
