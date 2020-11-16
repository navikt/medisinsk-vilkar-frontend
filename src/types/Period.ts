import { dateFromString } from '../util/dateUtils';

export class Period {
    fom: string;
    tom: string;

    constructor(fom: string, tom: string) {
        this.fom = fom;
        this.tom = tom;
    }

    includesDate(dateString: string) {
        const dateInQuestion = dateFromString(dateString);
        const fomDayjs = dateFromString(this.fom);
        const tomDayjs = dateFromString(this.tom);
        return (
            (dateInQuestion.isSame(fomDayjs) || dateInQuestion.isAfter(fomDayjs)) &&
            (dateInQuestion.isSame(tomDayjs) || dateInQuestion.isBefore(tomDayjs))
        );
    }
}
