import { DevTool } from '@hookform/devtools';
import moment from 'moment';
import { Datovelger } from 'nav-datovelger';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Label, Radio, RadioGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { Controller, FieldError, useForm } from 'react-hook-form';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';
import DiagnosekodeSelektor from './DiagnosekodeSelector';
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

    const legeerklæringSignertTest = '2020-09-11';

    const { register, handleSubmit, errors, control } = useForm<FormInput>({
        defaultValues: {
            legeerklæringSignert: legeerklæringSignertTest,
            innleggelseDatoFra: '2020-10-01',
            innleggelseDatoTil: '2020-10-03',
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
                    <Label htmlFor="legeerklæringSignert">
                        Hvilken dato ble legeerklæringen signert?
                    </Label>
                    <Controller
                        control={control}
                        render={({ onChange, onBlur, value }) => (
                            <Datovelger
                                onChange={onChange}
                                valgtDato={value}
                                input={{
                                    inputRef: register({
                                        required: true,
                                        validate: validateLegeerklæringSignert,
                                    }),
                                    id: 'legeerklæringSignert',
                                    name: 'legeerklæringSignert',
                                    placeholder: 'dd.mm.åååå',
                                }}
                                avgrensninger={{
                                    minDato: sykdom.periodeTilVurdering.fom,
                                    maksDato: sykdom.periodeTilVurdering.tom,
                                }}
                            />
                        )}
                        name="legeerklæringSignert"
                        rules={{ required: true, validate: validateLegeerklæringSignert }}
                    />
                    {/* <Datovelger
                        // onChange={setDato}
                        // valgtDato={dato}
                        input={{
                            inputRef: register({
                                required: true,
                                validate: validateLegeerklæringSignert,
                            }),
                            id: 'legeerklæringSignert',
                            name: 'legeerklæringSignert',
                            placeholder: 'dd.mm.åååå',
                        }}
                        avgrensninger={{
                            minDato: sykdom.periodeTilVurdering.fom,
                            maksDato: sykdom.periodeTilVurdering.tom,
                        }}
                    /> */}
                    {errors.legeerklæringSignert &&
                        legeerklæringSignertValidationMessage(errors.legeerklæringSignert)}
                </div>
                <div className={styles.inputContainer}>
                    <DiagnosekodeSelektor
                        control={control}
                        initialDiagnosekodeValue={sykdom.legeerklæringer[0]?.diagnosekode}
                    />
                    {errors.legeerklæringDiagnose && <Error />}
                </div>
                <div className={styles.inputContainer}>
                    <p>Hvilke datoer gjelder innleggelsen?</p>
                    <div style={{ display: 'flex' }}>
                        <div style={{ marginRight: '1.5rem' }}>
                            <Label className={styles.visuallyHidden} htmlFor="legeerklæringDatoFra">
                                Innleggelsen gjelder fra
                            </Label>
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <Datovelger
                                        onChange={onChange}
                                        valgtDato={value}
                                        input={{
                                            inputRef: register({
                                                required: true,
                                                validate: validateInnleggelseDatoFra,
                                            }),
                                            id: 'innleggelseDatoFra',
                                            name: 'innleggelseDatoFra',
                                            placeholder: 'dd.mm.åååå',
                                        }}
                                    />
                                )}
                                name="innleggelseDatoFra"
                                rules={{ required: true, validate: validateInnleggelseDatoFra }}
                            />
                            {/* <Datovelger
                                onChange={setInnleggelseDatoFra}
                                valgtDato={innleggelseDatoFra}
                                input={{
                                    inputRef: register({
                                        required: true,
                                        validate: validateInnleggelseDatoFra,
                                    }),
                                    id: 'innleggelseDatoFra',
                                    name: 'innleggelseDatoFra',
                                    placeholder: 'dd.mm.åååå',
                                }}
                            /> */}
                        </div>
                        <div>
                            <Label className={styles.visuallyHidden} htmlFor="legeerklæringDatoTil">
                                Innleggelsen gjelder til
                            </Label>
                            <Controller
                                control={control}
                                render={({ onChange, onBlur, value }) => (
                                    <Datovelger
                                        onChange={onChange}
                                        valgtDato={value}
                                        input={{
                                            inputRef: register({
                                                required: true,
                                                validate: validateInnleggelseDatoTil,
                                            }),
                                            id: 'innleggelseDatoTil',
                                            name: 'innleggelseDatoTil',
                                            placeholder: 'dd.mm.åååå',
                                        }}
                                    />
                                )}
                                name="innleggelseDatoTil"
                                rules={{ required: true, validate: validateInnleggelseDatoTil }}
                            />
                            {/* <Datovelger
                                onChange={setInnleggelseDatoTil}
                                valgtDato={innleggelseDatoTil}
                                input={{
                                    inputRef: register({
                                        required: true,
                                        validate: validateInnleggelseDatoTil,
                                    }),
                                    id: 'innleggelseDatoTil',
                                    name: 'innleggelseDatoTil',
                                    placeholder: 'dd.mm.åååå',
                                }}
                            /> */}
                        </div>
                    </div>
                    {(errors.innleggelseDatoFra || errors.innleggelseDatoTil) &&
                        innleggelseDatoValidationMessage(
                            errors.innleggelseDatoFra || errors.innleggelseDatoTil
                        )}
                </div>
                <div className={styles.fieldContainerSmall}>
                    <Hovedknapp>Gå videre</Hovedknapp>
                </div>
            </form>
        </>
    );
};

export default Legeerklæring;
