import { DevTool } from '@hookform/devtools';
import moment from 'moment';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { FieldError, useForm } from 'react-hook-form';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';
import Datepicker from '../form/wrappers/DatePicker';
import DiagnosekodeSelektor from './DiagnosekodeSelector';
import Error from './Error';
import { required } from '../form/validators';
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
    const validateLegeerklæringSignert = (legeerklæringSignert: Date) => {
        if (!legeerklæringSignert) {
            return true;
        }

        return moment(sykdom.periodeTilVurdering.fom).isSameOrBefore(
            moment(legeerklæringSignert, 'DD.MM.YYYY')
        );
    };

    const validateInnleggelseDatoFra = (innleggelseDatoFra: Date) => {
        if (!innleggelseDatoFra) {
            return true;
        }
        return moment(sykdom.periodeTilVurdering.fom).isSameOrBefore(
            moment(innleggelseDatoFra, 'DD.MM.YYYY')
        );
    };

    const validateInnleggelseDatoTil = (innleggelseDatoTil: Date) => {
        if (!innleggelseDatoTil) {
            return true;
        }

        return moment(sykdom.periodeTilVurdering.tom).isSameOrAfter(
            moment(innleggelseDatoTil, 'DD.MM.YYYY')
        );
    };

    const { register, handleSubmit, errors, control } = useForm<FormInput>({
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

    const legeerklæringSignertValidationMessage = (error: FieldError) => {
        if (error.type === 'validate') {
            return <Error message="Datoen må være innenfor søknadsperioden" />;
        }
        return <Error />;
    };

    const innleggelseDatoValidationMessage = (error: FieldError) => {
        if (error.type === 'validate') {
            return <Error message="Datoen må være innenfor søknadsperioden" />; // TODO: valideringsbeskjed for før-dato etter etter-dato og omvendt
        }
        return <Error />;
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
                        label="Når ble legeerklæringen signert?"
                        control={control}
                        name="legeerklæringSignert"
                        validators={{ required }}
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
                        label="Er det fastsatt en diagnose?"
                    />
                </div>
                <div className={styles.inputContainer}>
                    <p>Hvilke datoer gjelder innleggelsen?</p>
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '1.5rem' }}>
                            <Datepicker
                                label="Innleggelsen gjelder fra"
                                control={control}
                                name="innleggelseDatoFra"
                                validators={{ required }}
                                errors={errors}
                            />
                        </div>
                        <div>
                            <Datepicker
                                label="Innleggelsen gjelder til"
                                control={control}
                                name="innleggelseDatoTil"
                                validators={{ required }}
                                errors={errors}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles.fieldContainerSmall}>
                    <Hovedknapp>Gå videre</Hovedknapp>
                </div>
            </form>
        </>
    );
};

export default Legeerklæring;
