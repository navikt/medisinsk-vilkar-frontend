import React from 'react';
import { Radio, RadioGruppe, Textarea } from 'nav-frontend-skjema';
import Knapp from 'nav-frontend-knapper';
import './aktivitetForm.scss';

export default ({ onSubmit, onCancel }) => {
    const [begrunnelse, setBegrunnelse] = React.useState('');
    const [godkjenning, setGodkjenning] = React.useState(null);

    return (
        <form
            className="opptjeningAktivitetForm"
            onSubmit={(event) => onSubmit(event, { begrunnelse, godkjenning })}
        >
            <div className="opptjeningAktivitetForm__element">
                <RadioGruppe legend="Vurdering">
                    <div className="godkjenningGroup">
                        <Radio
                            label="Aktiviteten godkjennes"
                            value="godkjent"
                            name="status"
                            onChange={(e) => setGodkjenning(e.target.value)}
                        />
                        <Radio
                            label="Aktiviteten godkjennes ikke"
                            value="ikkeGodkjent"
                            name="status"
                            onChange={(e) => setGodkjenning(e.target.value)}
                        />
                    </div>
                </RadioGruppe>
            </div>
            <div className="opptjeningAktivitetForm__element">
                <Textarea
                    label="Begrunn vurderingen"
                    onChange={(e) => {
                        setBegrunnelse(e.target.value);
                    }}
                    value={begrunnelse}
                />
            </div>
            <div className="opptjeningAktivitetForm__buttons">
                <Knapp type="hoved" mini htmlType="submit">
                    Oppdater
                </Knapp>
                <Knapp type="standard" mini htmlType="button" onClick={onCancel}>
                    Avbryt
                </Knapp>
            </div>
        </form>
    );
};
