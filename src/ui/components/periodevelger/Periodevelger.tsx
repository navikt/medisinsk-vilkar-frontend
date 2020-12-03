import * as React from 'react';
import { required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';

interface PeriodeVelgerProps {
    name: string;
    dryRun: () => void;
}

const fom = 'fom';
const tom = 'tom';

const Periodevelger = ({ dryRun, name }: PeriodeVelgerProps): JSX.Element => {
    const [fomUtfylt, setFomUtfylt] = React.useState(false);
    const [tomUtfylt, setTomUtfylt] = React.useState(false);

    React.useEffect(() => {
        if (fomUtfylt && tomUtfylt) {
            dryRun();
        }
    }, [fomUtfylt, tomUtfylt, dryRun]);

    const validerFelt = (value, feltnavn: string) => {
        const requiredResult = required(value);
        const isValid = requiredResult === true;

        if (feltnavn === fom) {
            setFomUtfylt(isValid);
        } else {
            setTomUtfylt(isValid);
        }

        return isValid || requiredResult;
    };

    return (
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
                },
                toDatepickerProps: {
                    name: tom,
                    label: 'Til',
                    validators: {
                        validerFelt: (value) => validerFelt(value, tom),
                    },
                },
            }}
        />
    );
};

export default Periodevelger;
