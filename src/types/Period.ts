import dayjs from 'dayjs';

export class Period {
    fom: string;
    tom: string;

    constructor(fom: string, tom: string) {
        this.fom = fom;
        this.tom = tom;
    }

    includesDate(dateString: string) {
        const dateInQuestion = dayjs(dateString);
        const fomDayjs = dayjs(this.fom);
        const tomDayjs = dayjs(this.tom);
        return (
            (dateInQuestion.isSame(fomDayjs) || dateInQuestion.isAfter(fomDayjs)) &&
            (dateInQuestion.isSame(tomDayjs) || dateInQuestion.isBefore(tomDayjs))
        );
    }
}
