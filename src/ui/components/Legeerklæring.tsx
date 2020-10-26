import { DevTool } from '@hookform/devtools';
import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';
import {
    isDateAfterOtherDate,
    isDateBeforeOtherDate,
    isDateInPeriod,
    required,
} from '../form/validators';
import Datepicker from '../form/wrappers/DatePicker';
import DiagnosekodeSelektor from '../form/wrappers/DiagnosekodeSelector';
import RadioGroupPanel from '../form/wrappers/RadioGroupPanel';
import YesOrNoQuestion from '../form/wrappers/YesOrNoQuestion';
import Box, { Margin } from './Box';
import styles from './legeerklæring.less';

interface FormInput {
    legeerklæringLege: string;
    legeerklæringSignert: string;
    legeerklæringDiagnose: string;
    innleggelseDatoFra: string;
    innleggelseDatoTil: string;
}

interface LegeerklæringProps {
    sykdom: Sykdom;
}

const harDokumentasjonFieldName = 'harDokumentasjon';
const innleggelseDatoFraFieldName = 'innleggelseDatoFra';
const innleggelseDatoTilFieldName = 'innleggelseDatoTil';
const innleggelsesperioderFieldName = 'innleggelseperioder';

const Legeerklæring = ({ sykdom }: LegeerklæringProps): JSX.Element => {
    const formMethods = useFormContext<FormInput>();
    const { watch, control } = formMethods;

    const harDokumentasjon = watch(harDokumentasjonFieldName);
    const innleggelseDatoFra = watch(innleggelseDatoFraFieldName);
    const innleggelseDatoTil = watch(innleggelseDatoTilFieldName);

    const { fields, append, remove } = useFieldArray({
        control,
        name: innleggelsesperioderFieldName,
    });

    return (
        <>
            <DevTool control={control} />
            <Box marginTop={Margin.medium}>
                <YesOrNoQuestion
                    question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                    name={harDokumentasjonFieldName}
                    validators={{ required }}
                />
            </Box>
            {harDokumentasjon === false && (
                <Box marginTop={Margin.medium}>
                    <RadioGroupPanel
                        question="Hvem har signert legeerklæringen?"
                        name="signertAv"
                        radios={[
                            { label: 'Fastlege', value: 'fastlege' },
                            { label: 'Annen yrkesgruppe', value: 'annenYrkesgruppe' },
                        ]}
                        validators={{ required }}
                    />
                </Box>
            )}
            <Box marginTop={Margin.medium}>
                <Datepicker
                    label="Hvilken dato ble legeerklæringen signert?"
                    name="legeerklæringSignert"
                    validators={{
                        required,
                        isDateInPeriodeTilVurdering: (value) =>
                            isDateInPeriod(value, sykdom?.periodeTilVurdering),
                    }}
                    limitations={{
                        minDate: sykdom.periodeTilVurdering.fom,
                        maxDate: sykdom.periodeTilVurdering.tom,
                    }}
                />
            </Box>
            <Box marginTop={Margin.medium}>
                <DiagnosekodeSelektor
                    name="legeerklæringDiagnose"
                    initialDiagnosekodeValue={sykdom.legeerklæringer[0]?.diagnosekode}
                    validators={{ required }}
                    label="Oppgi diagnose(r) som er fastsatt"
                />
            </Box>
            <Box marginTop={Margin.medium}>
                <fieldset className={styles.fieldset}>
                    <legend className={styles.legend}>Periode for eventuelle innleggelser</legend>
                    {fields.map((item, index) => (
                        <Box marginBottom={Margin.medium} key={item.id}>
                            <div className={styles.flexContainer}>
                                <div className={styles.datePeriodContainer}>
                                    <Datepicker
                                        ariaLabel="Innleggelsen gjelder fra"
                                        name={`${innleggelsesperioderFieldName}[${index}].fra`}
                                        defaultValue={item.fra}
                                        limitations={{
                                            minDate: sykdom.periodeTilVurdering.fom,
                                            maxDate: sykdom.periodeTilVurdering.tom,
                                        }}
                                        validators={{
                                            required,
                                            isDateInPeriodeTilVurdering: (value) =>
                                                isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                            isDateBeforeInnleggelseDatoTil: (value) =>
                                                isDateBeforeOtherDate(value, innleggelseDatoTil),
                                        }}
                                    />
                                </div>
                                <div>
                                    <Datepicker
                                        ariaLabel="Innleggelsen gjelder til"
                                        name={`${innleggelsesperioderFieldName}[${index}].til`}
                                        defaultValue={item.til}
                                        limitations={{
                                            minDate: sykdom.periodeTilVurdering.fom,
                                            maxDate: sykdom.periodeTilVurdering.tom,
                                        }}
                                        validators={{
                                            required,
                                            isDateInPeriodeTilVurdering: (value) =>
                                                isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                            isDateAfterInnleggelseDatoFra: (value) =>
                                                isDateAfterOtherDate(value, innleggelseDatoFra),
                                        }}
                                    />
                                </div>
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
                            </div>
                        </Box>
                    ))}
                    <button
                        className={styles.buttonAdd}
                        type="button"
                        onClick={() => append({ fra: '', til: '' })}
                    >
                        Legg til flere perioder
                    </button>
                </fieldset>
            </Box>
        </>
    );
};

export default Legeerklæring;
