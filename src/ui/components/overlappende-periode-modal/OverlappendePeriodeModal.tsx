import React from 'react';
import Modal from 'nav-frontend-modal';
import Alertstripe from 'nav-frontend-alertstriper';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';
import ConfirmationModal from '../confirmation-modal/ConfirmationModal';
import { prettifyPeriod } from '../../../util/formats';
import Box, { Margin } from '../box/Box';

interface OverlappendePeriodeModalProps {
    appElementId: string;
    perioderMedEndring: PeriodeMedEndring[];
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
    isLoading: boolean;
}

const renderInfoMsg = ({ periode }: PeriodeMedEndring) => (
    <Box marginBottom={Margin.medium}>
        <Alertstripe type="info">
            {`${prettifyPeriod(
                periode
            )} overlapper med en tidligere vurdert periode lagt til i denne behandlingen. Den nye
        vurderingen vil erstatte den gamle.`}
        </Alertstripe>
    </Box>
);

const renderWarningMsg = ({ periode }: PeriodeMedEndring) => (
    <Box marginBottom={Margin.medium}>
        <Alertstripe type="advarsel">
            {`${prettifyPeriod(
                periode
            )} overlapper med en tidligere vurdert periode. Dersom ny vurdering medfører endring i
        resultat vil det bli sendt melding om nytt vedtak til bruker. Dette vil også gjelde eventuelle andre parter.`}
        </Alertstripe>
    </Box>
);

const OverlappendePeriodeModal = ({
    appElementId,
    perioderMedEndring,
    onConfirm,
    onCancel,
    isOpen,
    isLoading,
}: OverlappendePeriodeModalProps) => {
    Modal.setAppElement(`#${appElementId}`);

    const overlappendePerioderISammeBehandling =
        perioderMedEndring.filter(({ endrerVurderingSammeBehandling }) => endrerVurderingSammeBehandling === true) ||
        [];
    const overlappendePerioderIAndreBehandlinger =
        perioderMedEndring.filter(({ endrerAnnenVurdering }) => endrerAnnenVurdering === true) || [];

    const harFlerePerioderMedOverlapp = perioderMedEndring.length > 1;

    return (
        <ConfirmationModal onConfirm={onConfirm} onCancel={onCancel} isOpen={isOpen} isLoading={isLoading}>
            <Systemtittel>Overlappende periode</Systemtittel>
            <Box marginTop={Margin.large}>
                {overlappendePerioderISammeBehandling.map(renderInfoMsg)}
                {overlappendePerioderIAndreBehandlinger.map(renderWarningMsg)}
                <Box marginTop={Margin.large}>
                    <Normaltekst>
                        {`Er du sikker på at du vil erstatte ${
                            harFlerePerioderMedOverlapp
                                ? 'de tidligere vurderte periodene'
                                : 'den tidligere vurderte perioden'
                        }?`}
                    </Normaltekst>
                </Box>
            </Box>
        </ConfirmationModal>
    );
};

export default OverlappendePeriodeModal;
