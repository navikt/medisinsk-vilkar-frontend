import React from 'react';
import Alertstripe from 'nav-frontend-alertstriper';
import { Dokumentoversikt } from '../../../types/Dokumentoversikt';
import Box, { Margin } from '../box/Box';
import FristForDokumentasjonUtløptPanel from '../frist-for-dokumentasjon-utløpt-panel/FristForDokumentasjonUtløptPanel';

interface DokumentoversiktMessagesProps {
    dokumentoversikt: Dokumentoversikt;
    harRegistrertDiagnosekode: boolean;
}

const DokumentoversiktMessages = ({ dokumentoversikt, harRegistrertDiagnosekode }: DokumentoversiktMessagesProps) => {
    const { ustrukturerteDokumenter } = dokumentoversikt;
    return (
        <>
            {harRegistrertDiagnosekode === false && (
                <Box marginBottom={Margin.medium}>
                    <Alertstripe type="advarsel">
                        Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
                    </Alertstripe>
                </Box>
            )}
            {!dokumentoversikt.harGyldigSignatur() && dokumentoversikt.harDokumenter() && (
                <>
                    <Box marginBottom={Margin.medium}>
                        <Alertstripe type="advarsel">
                            Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. Håndter eventuelle
                            nye dokumenter, eller sett saken på vent mens du innhenter mer dokumentasjon.
                        </Alertstripe>
                    </Box>
                    {ustrukturerteDokumenter.length === 0 && (
                        <Box marginBottom={Margin.large}>
                            <FristForDokumentasjonUtløptPanel onProceedClick={() => console.log('1')} />
                        </Box>
                    )}
                </>
            )}
            {dokumentoversikt.harDokumenter() === false && (
                <Alertstripe type="info">Ingen dokumenter å vise</Alertstripe>
            )}
        </>
    );
};

export default DokumentoversiktMessages;
