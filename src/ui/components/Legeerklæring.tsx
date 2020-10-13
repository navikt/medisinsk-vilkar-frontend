import { yupResolver } from '@hookform/resolvers/yup';
import { Datovelger } from 'nav-datovelger';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Input, Label, Radio, RadioGruppe } from 'nav-frontend-skjema';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import Error from './Error';
import styles from './legeerklæring.less';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';

interface FormInput {
    legeerklæringLege: string;
    legeerklæringSignert: string;
    legeerklæringDiagnose: string;
    legeerklæringDatoFra: string;
    legeerklæringDatoTil: string;
}

interface LegeerklæringProps {
    changeTab: (index: number) => void;
    thisTab: number;
    sykdom: Sykdom;
}

const legeerklæringRadioGroupName = 'legeerklæringLege';

const Legeerklæring = ({ changeTab, thisTab, sykdom }: LegeerklæringProps): JSX.Element => {
    const schema = yup.object().shape({
        legeerklæringLege: yup.string().required(),
        legeerklæringSignert: yup.date().min(sykdom.periodeTilVurdering.fom).required(),
        legeerklæringDiagnose: yup.string().required(),
        legeerklæringDatoFra: yup.date().min(sykdom.periodeTilVurdering.fom).required(),
        legeerklæringDatoTil: yup.date().max(sykdom.periodeTilVurdering.tom).required(),
    });

    const { register, handleSubmit, errors } = useForm<FormInput>({
        resolver: yupResolver(schema),
    });
    const onSubmit = (data) => {
        console.log(data);
        changeTab(thisTab + 1);
    };

    const [dato, setDato] = useState('');
    const [legeerklæringDatoFra, setLegeerklæringDatoFra] = useState('');
    const [legeerklæringDatoTil, setLegeerklæringDatoTil] = useState('');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.inputContainer}>
                <RadioGruppe legend="Hvilken lege har signert legeerklæringen?">
                    <Radio
                        label="Sykehuslege"
                        name={legeerklæringRadioGroupName}
                        radioRef={register}
                        value="SYKEHUSLEGE"
                    />
                    <Radio
                        label="Spesialisthelsetjeneste"
                        name={legeerklæringRadioGroupName}
                        radioRef={register}
                        value="SPESIALISTHELSETJENESTE"
                    />
                    <Radio
                        label="Fastlege"
                        name={legeerklæringRadioGroupName}
                        radioRef={register}
                        value="FASTLEGE"
                    />
                    <Radio
                        label="Annet"
                        name={legeerklæringRadioGroupName}
                        radioRef={register}
                        value="ANNET"
                    />
                </RadioGruppe>
                {errors.legeerklæringLege && <Error />}
            </div>
            <div className={styles.inputContainer}>
                <Label htmlFor="legeerklæringSignert">
                    Hvilken dato ble legeerklæringen signert?
                </Label>
                <Datovelger
                    onChange={setDato}
                    valgtDato={dato}
                    input={{
                        inputRef: register,
                        id: 'legeerklæringSignert',
                        name: 'legeerklæringSignert',
                        placeholder: 'dd.mm.åååå',
                    }}
                    avgrensninger={{
                        minDato: sykdom.periodeTilVurdering.fom,
                        maksDato: sykdom.periodeTilVurdering.tom,
                    }}
                />
                {errors.legeerklæringSignert && <Error />}
            </div>
            <div className={styles.inputContainer}>
                <Input
                    label="Er det fastsatt en diagnose?"
                    placeholder="Søk etter diagnose"
                    inputRef={register}
                    bredde="L"
                    name="legeerklæringDiagnose"
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
                        <Datovelger
                            onChange={setLegeerklæringDatoFra}
                            valgtDato={legeerklæringDatoFra}
                            input={{
                                inputRef: register,
                                id: 'legeerklæringDatoFra',
                                name: 'legeerklæringDatoFra',
                                placeholder: 'dd.mm.åååå',
                            }}
                        />
                    </div>
                    <div>
                        <Label className={styles.visuallyHidden} htmlFor="legeerklæringDatoTil">
                            Innleggelsen gjelder til
                        </Label>
                        <Datovelger
                            onChange={setLegeerklæringDatoTil}
                            valgtDato={legeerklæringDatoTil}
                            input={{
                                inputRef: register,
                                id: 'legeerklæringDatoTil',
                                name: 'legeerklæringDatoTil',
                                placeholder: 'dd.mm.åååå',
                            }}
                        />
                    </div>
                </div>
                {(errors.legeerklæringDatoFra || errors.legeerklæringDatoTil) && <Error />}
            </div>
            <div className={styles.fieldContainerSmall}>
                <Hovedknapp>Gå videre</Hovedknapp>
            </div>
        </form>
    );
};

export default Legeerklæring;
