import React from 'react';
import { Element } from 'nav-frontend-typografi';
import styles from './legeerklæring.less';
import RadioButton from './RadioButton';
import InputField from './InputField';

interface LegeerklæringProps {
    readOnly: boolean;
}

const legeerklæringRadioGroup = 'legeerklæring';

const Legeerklæring = ({ readOnly }: LegeerklæringProps) => (
    <>
        <Element>Legeerklæring</Element>
        <div className={styles.inputContainer}>
            <fieldset className={styles.fieldset}>
                <legend className={styles.legend}>Legeerklæring</legend>
                <RadioButton
                    label="Sykehuslege"
                    id="sykehuslege"
                    radioGroupName={legeerklæringRadioGroup}
                    value="SYKEHUSLEGE"
                    readOnly={readOnly}
                />
                <RadioButton
                    label="Spesialisthelsetjeneste"
                    id="spesialisthelsetjeneste"
                    radioGroupName={legeerklæringRadioGroup}
                    value="SPESIALISTHELSETJENESTE"
                    readOnly={readOnly}
                />
                <RadioButton
                    label="Fastlege"
                    id="fastlege"
                    radioGroupName={legeerklæringRadioGroup}
                    value="FASTLEGE"
                    readOnly={readOnly}
                />
                <RadioButton
                    label="Annet"
                    id="annet"
                    radioGroupName={legeerklæringRadioGroup}
                    value="ANNET"
                    readOnly={readOnly}
                />
            </fieldset>
        </div>
        <div className={styles.inputContainer}>
            <InputField
                id="legeerklæring-signert"
                label="Hvilken dato ble legeerklæringen signert?"
                readOnly={readOnly}
                placeholder="dd.mm.åååå"
            />
        </div>
        <div className={styles.inputContainer}>
            <InputField
                id="diagnose"
                label="Er det fastsatt en diagnose?"
                readOnly={readOnly}
                placeholder="Søk etter diagnose"
            />
        </div>
        <div className={styles.inputContainer}>
            <InputField
                id="innleggelse-dato"
                label="Hvilke datoer gjelder innleggelsen?"
                readOnly={readOnly}
                placeholder="dd.mm.åååå - dd.mm.åååå"
            />
        </div>
    </>
);

export default Legeerklæring;
