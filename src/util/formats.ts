import { Period } from '../types/Period';

export const prettifyDate = (date: string) => {
    return new Date(date).toLocaleDateString('no-NB');
};

export const prettifyPeriod = ({ fom, tom }: Period) =>
    `${prettifyDate(fom)} - ${prettifyDate(tom)}`;
