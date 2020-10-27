import React from 'react';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import Periodpicker, { PeriodpickerProps } from './form/pure/Periodpicker';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { LegeerklæringFormInput } from '../types/medisinsk-vilkår/LegeerklæringFormInput';
import styles from './components/legeerklæring.less';

interface PeriodpickerListProps {
    name: string;
    legend: string;
    periodpickerProps: PeriodpickerProps;
}

const PeriodpickerList = ({
    name,
    legend,
    periodpickerProps: { fromDatepickerProps, toDatepickerProps },
}: PeriodpickerListProps) => {
    const formMethods = useFormContext<LegeerklæringFormInput>();
    const { control } = formMethods;

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <SkjemaGruppe className={styles.fieldset} legend={legend}>
            {fields.map((item, index) => (
                <>
                    <Periodpicker
                        fromDatepickerProps={{
                            ...fromDatepickerProps,
                            defaultValue: item.fom,
                            name: `${name}[${index}].${fromDatepickerProps.name}`,
                        }}
                        toDatepickerProps={{
                            ...toDatepickerProps,
                            defaultValue: item.tom,
                            name: `${name}[${index}].${toDatepickerProps.name}`,
                        }}
                    />
                    {index > 0 && (
                        <div className={styles.buttonDeleteContainer}>
                            <button
                                className={styles.buttonDelete}
                                type="button"
                                onClick={() => remove(index)}
                            >
                                Fjern periode
                            </button>
                        </div>
                    )}
                </>
            ))}
            <button
                className={styles.buttonAdd}
                type="button"
                onClick={() =>
                    append({ [fromDatepickerProps.name]: '', [toDatepickerProps.name]: '' })
                }
            >
                Legg til flere perioder
            </button>
        </SkjemaGruppe>
    );
};

export default PeriodpickerList;
