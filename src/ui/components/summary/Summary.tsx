import React from 'react';
import ListOfTilsynStatusPanel from '../status-panel-tilsyn-list/ListOfTilsynStatusPanel';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { getPeriodDifference } from '../../../util/dateUtils';
import PeriodeMedGradAvTilsynsbehov from '../../../types/PeriodeMedGradAvTilsynsbehov';
import { lagPeriodeMedIngenTilsynsbehov } from '../../../util/periodeMedTilsynsbehov';

interface SummaryProps {
    perioderMedTilsynsbehov: PeriodeMedGradAvTilsynsbehov[];
    sykdom: Sykdom;
}

const Summary = ({ perioderMedTilsynsbehov, sykdom }: SummaryProps) => {
    const perioderMedBehov = perioderMedTilsynsbehov.map(({ periode }) => periode);
    const perioderUtenTilsynsbehov = getPeriodDifference(sykdom.periodeTilVurdering, perioderMedBehov).map(
        lagPeriodeMedIngenTilsynsbehov
    );

    return (
        <div style={{ marginTop: '2rem' }}>
            <ListOfTilsynStatusPanel
                perioderMedGradAvTilsynsbehov={[...perioderMedTilsynsbehov, ...perioderUtenTilsynsbehov]}
            />
        </div>
    );
};

export default Summary;
