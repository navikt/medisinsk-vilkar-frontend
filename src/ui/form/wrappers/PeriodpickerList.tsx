import { SkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { LegeerklæringFormInput } from '../../../types/medisinsk-vilkår/LegeerklæringFormInput';
import Box, { Margin } from '../../components/box/Box';
import Periodpicker, { PeriodpickerProps } from '../pure/Periodpicker';
import styles from './periodpickerList.less';

const AddButton = ({ onClick }) => (
    <button className={styles.buttonAdd} type="button" onClick={onClick}>
        Legg til flere perioder
    </button>
);

const DeleteButton = ({ onClick }) => (
    <div className={styles.buttonDeleteContainer}>
        <button className={styles.buttonDelete} type="button" onClick={onClick}>
            Fjern periode
        </button>
    </div>
);

interface PeriodpickerListProps {
    name: string;
    legend: string;
    periodpickerProps: PeriodpickerProps;
}

const PeriodpickerList = ({
    name,
    legend,
    periodpickerProps: { fromDatepickerProps, toDatepickerProps },
}: PeriodpickerListProps): JSX.Element => {
    const formMethods = useFormContext<LegeerklæringFormInput>();
    const { control } = formMethods;
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <SkjemaGruppe legend={legend}>
            {fields.map((item, index) => (
                <Box marginTop={index > 0 ? Margin.medium : undefined}>
                    <div className={styles.flexContainer}>
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
                        {index > 0 && <DeleteButton onClick={() => remove(index)} />}
                    </div>
                </Box>
            ))}
            <Box marginTop={Margin.medium}>
                <AddButton
                    onClick={() =>
                        append({ [fromDatepickerProps.name]: '', [toDatepickerProps.name]: '' })
                    }
                />
            </Box>
        </SkjemaGruppe>
    );
};

export default PeriodpickerList;