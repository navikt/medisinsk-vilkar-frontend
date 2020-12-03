import * as React from 'react';
import { Period } from '../../../types/Period';
import { convertToInternationalPeriod } from '../../../util/formats';
import { finnHullIPeriodeTilVurdering } from '../../../util/periodUtils';
import { datoErIkkeIEtHull, datoErInnenforPerioderTilVurdering, required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';

interface PeriodeVelgerProps {
    dryRun: () => void;
    perioderSomSkalVurderes: Period[];
    name: string;
}

const fom = 'fom';
const tom = 'tom';

const finnFeilmelding = (validatorresultater: (string | true)[]) => {
    const feilmelding = validatorresultater.find((resultat) => resultat !== true);
    return feilmelding || '';
};

const Periodevelger = ({ dryRun, name, perioderSomSkalVurderes }: PeriodeVelgerProps): JSX.Element => {
    const [fomUtfylt, setFomUtfylt] = React.useState(false);
    const [tomUtfylt, setTomUtfylt] = React.useState(false);

    React.useEffect(() => {
        if (fomUtfylt && tomUtfylt) {
            dryRun();
        }
    }, [fomUtfylt, tomUtfylt, dryRun]);

    const validerFelt = (value, feltnavn: string) => {
        const requiredResult = required(value);
        const datoErIPerioderTilVurdering = datoErInnenforPerioderTilVurdering(value, perioderSomSkalVurderes);
        const datoSkalIkkeVæreIEtHull = datoErIkkeIEtHull(value, perioderSomSkalVurderes);
        const isValid =
            requiredResult === true && datoErIPerioderTilVurdering === true && datoSkalIkkeVæreIEtHull === true;
        const feilmelding = finnFeilmelding([requiredResult, datoErIPerioderTilVurdering, datoSkalIkkeVæreIEtHull]);

        if (feltnavn === fom) {
            setFomUtfylt(isValid);
        } else {
            setTomUtfylt(isValid);
        }

        return isValid || feilmelding;
    };

    const hullIPeriodeTilVurdering = finnHullIPeriodeTilVurdering(perioderSomSkalVurderes).map((periode) =>
        convertToInternationalPeriod(periode)
    );

    return (
        <>
            <PeriodpickerList
                legend="Oppgi perioder"
                name={name}
                periodpickerProps={{
                    fromDatepickerProps: {
                        name: fom,
                        label: 'Fra',
                        validators: {
                            validerFelt: (value) => validerFelt(value, fom),
                        },
                        limitations: {
                            minDate: perioderSomSkalVurderes[0].fom,
                            maxDate: perioderSomSkalVurderes[perioderSomSkalVurderes.length - 1].tom,
                            invalidDateRanges: hullIPeriodeTilVurdering,
                        },
                    },
                    toDatepickerProps: {
                        name: tom,
                        label: 'Til',
                        validators: {
                            validerFelt: (value) => validerFelt(value, tom),
                        },
                        limitations: {
                            minDate: perioderSomSkalVurderes[0].fom,
                            maxDate: perioderSomSkalVurderes[perioderSomSkalVurderes.length - 1].tom,
                            invalidDateRanges: hullIPeriodeTilVurdering,
                        },
                    },
                }}
            />
        </>
    );
};

export default Periodevelger;
