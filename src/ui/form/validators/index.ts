import moment from 'moment';

export function required(v: any) {
    if (v === null || v === undefined || v === '') {
        return 'Du må oppgi en verdi';
    }
}

export const isDateInPeriod = (date: any, datePeriod: { fom: string; tom: string }): string => {
    if (
        moment(datePeriod.fom).isSameOrBefore(moment(date)) &&
        moment(datePeriod.tom).isSameOrAfter(moment(date))
    ) {
        return undefined;
    }

    return 'Dato må være innenfor søknadsperioden';
};

export const isDateBeforeOtherDate = (date: string, otherDate: string) => {
    if (!otherDate || moment(date).isBefore(otherDate)) {
        return undefined;
    }

    return 'Dato må være før til-dato';
};

export const isDateAfterOtherDate = (date: string, otherDate: string) => {
    if (!otherDate || moment(date).isAfter(otherDate)) {
        return undefined;
    }

    return 'Dato må være etter fra-dato';
};
