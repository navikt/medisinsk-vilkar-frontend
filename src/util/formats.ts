import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Period } from '../types/Period';

dayjs.extend(utc);

export const prettifyDate = (date: string) => {
    return dayjs(date).utc(true).format('D.M.YYYY');
};

export const prettifyPeriod = ({ fom, tom }: Period) => `${prettifyDate(fom)} - ${prettifyDate(tom)}`;

export const convertToInternationalPeriod = ({ fom, tom }: Period) => ({
    from: fom,
    to: tom,
});
