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
import Box, { Margins } from './Box';
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
                <Box marginTop={Margins.medium}>
                    <YesOrNoQuestion
                        question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                        name={harDokumentasjonFieldName}
                        control={control}
                        errors={errors}
                        validators={{ required }}
                    />
                </Box>
                {harDokumentasjon === false && (
                    <Box marginTop={Margins.medium}>
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
                    </Box>
                )}
                <Box marginTop={Margins.medium}>
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
                </Box>
                <Box marginTop={Margins.medium}>
                    <DiagnosekodeSelektor
                        control={control}
                        name="legeerklæringDiagnose"
                        initialDiagnosekodeValue={sykdom.legeerklæringer[0]?.diagnosekode}
                        validators={{ required }}
                        errors={errors}
                        label="Oppgi diagnose(r) som er fastsatt"
                    />
                </Box>
                <Box marginTop={Margins.medium}>
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>
                            Periode for eventuelle innleggelser
                        </legend>
                        <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: '1.5rem' }}>
                                <Datepicker
                                    ariaLabel="Innleggelsen gjelder fra"
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
                                    ariaLabel="Innleggelsen gjelder til"
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
                </Box>
                <Box marginTop={Margins.large}>
                    <Hovedknapp>Gå videre</Hovedknapp>
                </Box>
            </form>
        </>
    );
};

export default Legeerklæring;
