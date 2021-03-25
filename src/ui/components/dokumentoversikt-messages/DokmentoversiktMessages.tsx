import Alertstripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import React from 'react';
import { Dokumentoversikt } from '../../../types/Dokumentoversikt';
import ContainerContext from '../../context/ContainerContext';
import Box, { Margin } from '../box/Box';
import FristForDokumentasjonUtløptPanel from '../frist-for-dokumentasjon-utløpt-panel/FristForDokumentasjonUtløptPanel';

interface DokumentoversiktMessagesProps {
    dokumentoversikt: Dokumentoversikt;
    harRegistrertDiagnosekode: boolean;
    kanLøseAksjonspunkt: boolean;
    kanNavigereVidere: boolean;
    navigerTilNesteSteg: () => void;
}

const DokumentoversiktMessages = ({
    dokumentoversikt,
    harRegistrertDiagnosekode,
    kanLøseAksjonspunkt,
    kanNavigereVidere,
    navigerTilNesteSteg,
}: DokumentoversiktMessagesProps) => {
    const { onFinished } = React.useContext(ContainerContext);

    const { ustrukturerteDokumenter } = dokumentoversikt;

    const visFristForDokumentasjonUtløptMelding =
        ustrukturerteDokumenter.length === 0 && !dokumentoversikt.harGyldigSignatur();

    const visHåndterNyeDokumenterMelding =
        !dokumentoversikt.harGyldigSignatur() &&
        dokumentoversikt.harDokumenter() &&
        !visFristForDokumentasjonUtløptMelding;

    return (
        <>
            {harRegistrertDiagnosekode === false && (
                <Box marginBottom={Margin.medium}>
                    <Alertstripe type="advarsel">
                        Diagnosekode mangler. Du må legge til en diagnosekode for å vurdere tilsyn og pleie.
                    </Alertstripe>
                </Box>
            )}
            {visFristForDokumentasjonUtløptMelding && (
                <Box marginBottom={Margin.large}>
                    <FristForDokumentasjonUtløptPanel onProceedClick={() => console.log('1')} />
                </Box>
            )}
            {visHåndterNyeDokumenterMelding && (
                <>
                    <Box marginBottom={Margin.medium}>
                        <Alertstripe type="advarsel">
                            Dokumentasjon signert av sykehuslege/spesialisthelsetjenesten mangler. Håndter eventuelle
                            nye dokumenter, eller sett saken på vent mens du innhenter mer dokumentasjon.
                        </Alertstripe>
                    </Box>
                </>
            )}
            {dokumentoversikt.harDokumenter() === false && (
                <Alertstripe type="info">Ingen dokumenter å vise</Alertstripe>
            )}
            {kanLøseAksjonspunkt && (
                <Box marginBottom={Margin.medium}>
                    <Alertstripe type="info">
                        Sykdom er ferdig vurdert og du kan gå videre i behandlingen.
                        <Knapp
                            type="hoved"
                            htmlType="button"
                            style={{ marginLeft: '2rem', marginBottom: '-0.25rem' }}
                            onClick={onFinished}
                            mini
                        >
                            Fortsett
                        </Knapp>
                    </Alertstripe>
                </Box>
            )}
            {kanNavigereVidere && (
                <Box marginBottom={Margin.medium}>
                    <Alertstripe type="info">
                        Dokumentsteget er ferdig vurdert og du kan gå videre i vurderingen.
                        <Knapp
                            type="hoved"
                            htmlType="button"
                            style={{ marginLeft: '2rem', marginBottom: '-0.25rem' }}
                            onClick={navigerTilNesteSteg}
                            mini
                        >
                            Fortsett
                        </Knapp>
                    </Alertstripe>
                </Box>
            )}
        </>
    );
};

export default DokumentoversiktMessages;
