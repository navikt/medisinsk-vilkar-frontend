import { DevTool } from '@hookform/devtools';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { useForm } from 'react-hook-form';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';
import {
    isDateAfterOtherDate,
    isDateBeforeOtherDate,
    isDateInPeriod,
    required,
} from '../form/validators';
import Datepicker from '../form/wrappers/DatePicker';
import DiagnosekodeSelektor from '../form/wrappers/DiagnosekodeSelector';
import Error from './Error';
import styles from './legeerklæring.less';

interface FormInput {
    legeerklæringLege: string;
    legeerklæringSignert: string;
    legeerklæringDiagnose: string;
    innleggelseDatoFra: string;
    innleggelseDatoTil: string;
}

interface LegeerklæringProps {
    changeTab: (index: number) => void;
    thisTab: number;
    sykdom: Sykdom;
}

const legeerklæringRadioGroupName = 'legeerklæringLege';

const Legeerklæring = ({ changeTab, thisTab, sykdom }: LegeerklæringProps): JSX.Element => {
    const { register, handleSubmit, errors, control, getValues } = useForm<FormInput>({
        defaultValues: {
            legeerklæringSignert: undefined,
            innleggelseDatoFra: undefined,
            innleggelseDatoTil: undefined,
        },
    });

    const onSubmit = (data) => {
        console.log(data);
        // changeTab(thisTab + 1);
    };

    return (
        <>
            <DevTool control={control} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputContainer}>
                    <RadioGruppe legend="Hvilken lege har signert legeerklæringen?">
                        <Radio
                            label="Sykehuslege"
                            name={legeerklæringRadioGroupName}
                            radioRef={register({ required: true })}
                            value="SYKEHUSLEGE"
                        />
                        <Radio
                            label="Spesialisthelsetjeneste"
                            name={legeerklæringRadioGroupName}
                            radioRef={register({ required: true })}
                            value="SPESIALISTHELSETJENESTE"
                        />
                        <Radio
                            label="Fastlege"
                            name={legeerklæringRadioGroupName}
                            radioRef={register({ required: true })}
                            value="FASTLEGE"
                        />
                        <Radio
                            label="Annet"
                            name={legeerklæringRadioGroupName}
                            radioRef={register({ required: true })}
                            value="ANNET"
                        />
                    </RadioGruppe>
                    {errors.legeerklæringLege && <Error />}
                </div>
                <div className={styles.inputContainer}>
                    <Datepicker
                        label="Hvilken dato ble legeerklæringen signert?"
                        control={control}
                        name="legeerklæringSignert"
                        validators={{
                            required,
                            isDateInPeriodeTilVurdering: (value) =>
                                isDateInPeriod(value, sykdom?.periodeTilVurdering),
                        }}
                        errors={errors}
                        limitations={{
                            minDate: sykdom.periodeTilVurdering.fom,
                            maxDate: sykdom.periodeTilVurdering.tom,
                        }}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <DiagnosekodeSelektor
                        control={control}
                        name="legeerklæringDiagnose"
                        initialDiagnosekodeValue={sykdom.legeerklæringer[0]?.diagnosekode}
                        validators={{ required }}
                        errors={errors}
                        label="Oppgi diagnose(r) som er fastsatt"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>
                            Periode for eventuelle innleggelser
                        </legend>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '1.5rem' }}>
                                <Datepicker
                                    label="Innleggelsen gjelder fra"
                                    hiddenLabel
                                    control={control}
                                    name="innleggelseDatoFra"
                                    validators={{
                                        required,
                                        isDateInPeriodeTilVurdering: (value) =>
                                            isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                        isDateBeforeInnleggelseDatoTil: (value) => {
                                            const innleggelseDatoTil = getValues(
                                                'innleggelseDatoTil'
                                            );

                                            return isDateBeforeOtherDate(value, innleggelseDatoTil);
                                        },
                                    }}
                                    errors={errors}
                                />
                            </div>
                            <div>
                                <Datepicker
                                    label="Innleggelsen gjelder til"
                                    hiddenLabel
                                    control={control}
                                    name="innleggelseDatoTil"
                                    validators={{
                                        required,
                                        isDateInPeriodeTilVurdering: (value) =>
                                            isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                        isDateAfterInnleggelseDatoFra: (value) => {
                                            const innleggelseDatoFra = getValues(
                                                'innleggelseDatoFra'
                                            );

                                            return isDateAfterOtherDate(value, innleggelseDatoFra);
                                        },
                                    }}
                                    errors={errors}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className={styles.fieldContainerSmall}>
                    <Hovedknapp>Gå videre</Hovedknapp>
                </div>
            </form>
        </>
    );
};

export default Legeerklæring;
