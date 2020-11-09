import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
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
        <div style={{ padding: '50px 35px' }}>
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <hr />
            <ListOfTilsynStatusPanel
                perioderMedGradAvTilsynsbehov={[...perioderMedTilsynsbehov, ...perioderUtenTilsynsbehov]}
            />
        </div>
    );
};

export default Summary;
