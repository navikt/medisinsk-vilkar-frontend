import { DevTool } from '@hookform/devtools';
import { Hovedknapp } from 'nav-frontend-knapper';
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
import RadioGroupPanel from '../form/wrappers/RadioGroupPanel';
import YesOrNoQuestion from '../form/wrappers/YesOrNoQuestion';
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

const harDokumentasjonFieldName = 'harDokumentasjon';
const innleggelseDatoFraFieldName = 'innleggelseDatoFra';
const innleggelseDatoTilFieldName = 'innleggelseDatoTil';

const Legeerklæring = ({ changeTab, thisTab, sykdom }: LegeerklæringProps): JSX.Element => {
    const { watch, handleSubmit, errors, control } = useForm<FormInput>({
        defaultValues: {
            legeerklæringSignert: undefined,
            innleggelseDatoFra: undefined,
            innleggelseDatoTil: undefined,
        },
    });

    const harDokumentasjon = watch(harDokumentasjonFieldName);
    const innleggelseDatoFra = watch(innleggelseDatoFraFieldName);
    const innleggelseDatoTil = watch(innleggelseDatoTilFieldName);

    const onSubmit = (data) => {
        console.log(data);
        // changeTab(thisTab + 1);
    };

    return (
        <>
            <DevTool control={control} />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.inputContainer}>
                    <YesOrNoQuestion
                        question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                        name={harDokumentasjonFieldName}
                        control={control}
                        errors={errors}
                        validators={{ required }}
                    />
                </div>
                {harDokumentasjon === false && (
                    <div className={styles.inputContainer}>
                        <RadioGroupPanel
                            question="Hvem har signert legeerklæringen?"
                            name="signertAv"
                            radios={[
                                { label: 'Fastlege', value: 'fastlege' },
                                { label: 'Annen yrkesgruppe', value: 'annenYrkesgruppe' },
                            ]}
                            control={control}
                            errors={errors}
                            validators={{ required }}
                        />
                    </div>
                )}
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
                                        isDateBeforeInnleggelseDatoTil: (value) =>
                                            isDateBeforeOtherDate(value, innleggelseDatoTil),
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
                                        isDateAfterInnleggelseDatoFra: (value) =>
                                            isDateAfterOtherDate(value, innleggelseDatoFra),
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
