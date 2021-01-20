import { CalendarPlacement, DatepickerLimitations } from 'nav-datovelger';
import { SkjemaelementFeilmelding, SkjemaGruppe } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { Period } from '../../../types/Period';
import Box, { Margin } from '../../components/box/Box';
import PureDatepicker from '../pure/PureDatepicker';
import styles from './periodpickerList.less';

interface DatepickerProps {
    label?: string;
    ariaLabel?: string;
    limitations?: DatepickerLimitations;
    calendarSettings?: {
        position?: CalendarPlacement;
    };
}
interface PeriodpickerListProps {
    name: string;
    legend: string;
    validators?: { [key: string]: (v: any) => string | boolean | undefined };
    defaultValues?: Period[];
    fromDatepickerProps: DatepickerProps;
    toDatepickerProps: DatepickerProps;
    renderContentAfterElement?: (index: number, numberOfItems: number, fieldArrayMethods) => void;
    renderBeforeFieldArray?: (fieldArrayMethods) => void;
    renderAfterFieldArray?: (fieldArrayMethods) => void;
}
const PeriodpickerList = ({
    name,
    legend,
    validators,
    fromDatepickerProps,
    toDatepickerProps,
    defaultValues,
    renderBeforeFieldArray,
    renderAfterFieldArray,
    renderContentAfterElement,
}: PeriodpickerListProps): JSX.Element => {
    const formMethods = useFormContext();
    const { control, errors } = formMethods;
    const fieldArrayMethods = useFieldArray({
        control,
        name,
    });
    const { fields } = fieldArrayMethods;
    // const [showHiddenPeriods, setShowHiddenPeriods] = useState(false);

    return (
        <div className={styles.periodpickerList}>
            {renderBeforeFieldArray && renderBeforeFieldArray(fieldArrayMethods)}
            <SkjemaGruppe legend={legend}>
                {fields.map((item, index) => {
                    const errorMessage = errors[name] && errors[name][index]?.period.message;
                    // if (fields.length > 7 && !showHiddenPeriods) {
                    //     if (index === 7) {
                    //         return (
                    //             <button
                    //                 onClick={(e) => {
                    //                     e.preventDefault();
                    //                     setShowHiddenPeriods(true);
                    //                 }}
                    //                 type="button"
                    //             >
                    //                 Vis eldre innleggelsesperioder
                    //             </button>
                    //         );
                    //     }
                    //     if (index > 7) {
                    //         return null;
                    //     }
                    // }
                    return (
                        <Box key={item.id} marginTop={Margin.medium}>
                            <div className={styles.flexContainer}>
                                <Controller
                                    name={`${name}[${index}].period`}
                                    rules={{ validate: { ...(validators || {}) } }}
                                    defaultValue={defaultValues && defaultValues[index]}
                                    render={({ value, onChange }) => {
                                        return (
                                            <>
                                                <PureDatepicker
                                                    {...fromDatepickerProps}
                                                    label={fromDatepickerProps.label}
                                                    ariaLabel={fromDatepickerProps.ariaLabel}
                                                    value={value?.fom || ''}
                                                    onChange={(fomValue) =>
                                                        onChange(new Period(fomValue, value?.tom || ''))
                                                    }
                                                    inputId={`${name}[${index}].fom`}
                                                />
                                                <div style={{ display: 'flex', marginLeft: '1rem' }}>
                                                    <PureDatepicker
                                                        {...toDatepickerProps}
                                                        label={toDatepickerProps.label}
                                                        ariaLabel={toDatepickerProps.ariaLabel}
                                                        value={value?.tom || ''}
                                                        onChange={(tomValue) =>
                                                            onChange(new Period(value?.fom || '', tomValue))
                                                        }
                                                        inputId={`${name}[${index}].tom`}
                                                    />
                                                </div>
                                            </>
                                        );
                                    }}
                                />
                                {renderContentAfterElement &&
                                    renderContentAfterElement(index, fields.length, fieldArrayMethods)}
                            </div>
                            {errorMessage && <SkjemaelementFeilmelding>{errorMessage}</SkjemaelementFeilmelding>}
                        </Box>
                    );
                })}
            </SkjemaGruppe>
            {renderAfterFieldArray && renderAfterFieldArray(fieldArrayMethods)}
        </div>
    );
};
export default PeriodpickerList;
