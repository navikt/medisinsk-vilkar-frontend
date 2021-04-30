import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Period } from '../types/Period';

dayjs.extend(utc);

export const prettifyDate = (date: string | Dayjs) => dayjs(date).utc(true).format('DD.MM.YYYY');

export const prettifyPeriod = ({ fom, tom }: Period) => `${prettifyDate(fom)} - ${prettifyDate(tom)}`;

export const convertToInternationalPeriod = ({ fom, tom }: Period) => ({
    from: fom,
    to: tom,
});

export const prettifyPeriodList = (perioder: Period[]) => perioder.map((periode) => prettifyPeriod(periode)).join(', ');
