import { Period } from '../types/Period';

export const prettifyDate = (date: string) => {
    return new Date(date).toLocaleDateString('nb-NO');
};

export const prettifyPeriod = ({ fom, tom }: Period) => `${prettifyDate(fom)} - ${prettifyDate(tom)}`;

export const convertToInternationalPeriod = ({ fom, tom }: Period) => ({
    from: fom,
    to: tom,
});
