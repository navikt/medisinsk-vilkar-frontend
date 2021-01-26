import React from 'react';
import Panel from 'nav-frontend-paneler';
import { Normaltekst } from 'nav-frontend-typografi';
import { Checkbox } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import Box, { Margin } from '../box/Box';
import styles from './fristForDokumentasjonUtløptPanel.less';

interface FristForDokumentasjonUtløptPanelProps {
    onProceedClick: () => void;
}

const FristForDokumentasjonUtløptPanel = ({ onProceedClick }: FristForDokumentasjonUtløptPanelProps) => {
    const [fristenErUtløpt, setFristenErUtløpt] = React.useState(false);
    return (
        <Panel className={styles.fristForDokumentasjonUtløptPanel}>
            <Normaltekst>
                Dersom du ikke får dokumentasjon innen fristen, kan du avslå vilkåret og gå videre til vedtaksbrev.
            </Normaltekst>
            <div className={styles.fristForDokumentasjonUtløptPanel__formContainer}>
                <Box marginTop={Margin.small}>
                    <Checkbox
                        label="Legeerklæring fra sykehus/spesialisthelsetjenesten etter §9-16 første ledd er ikke mottatt innen fristen"
                        name="fristenErUtløpt"
                        checked={fristenErUtløpt === true}
                        onChange={() => setFristenErUtløpt(!fristenErUtløpt)}
                    />
                </Box>
                {fristenErUtløpt === true && (
                    <Hovedknapp
                        htmlType="button"
                        onClick={onProceedClick}
                        mini
                        className={styles.fristForDokumentasjonUtløptPanel__formContainer__gåVidereKnapp}
                    >
                        Gå videre
                    </Hovedknapp>
                )}
            </div>
        </Panel>
    );
};

export default FristForDokumentasjonUtløptPanel;
