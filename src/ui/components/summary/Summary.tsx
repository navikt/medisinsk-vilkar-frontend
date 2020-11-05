import React from 'react';
import ListOfTilsynStatusPanel from '../status-panel-tilsyn-list/ListOfTilsynStatusPanel';
import { Systemtittel } from 'nav-frontend-typografi';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { getPeriodDifference } from '../../../util/dateUtils';
import GradAvTilsynsbehov from '../../../types/GradAvTilsynsbehov';
import PeriodeMedTilsynsbehov from '../../../types/PeriodeMedTilsynsbehov';

interface SummaryProps {
    perioderMedTilsynsbehov: PeriodeMedTilsynsbehov[];
    sykdom: Sykdom;
}

const Summary = ({ perioderMedTilsynsbehov, sykdom }: SummaryProps) => {
    const perioderMedBehov = perioderMedTilsynsbehov.map(({ periode }) => periode);
    const perioderUtenTilsynsbehov = getPeriodDifference(sykdom.periodeTilVurdering, perioderMedBehov).map(
        (periode) => ({
            periode,
            grad: GradAvTilsynsbehov.IKKE_BEHOV,
        })
    );

    return (
        <div style={{ padding: '50px 35px' }}>
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <hr />
            <ListOfTilsynStatusPanel
                perioderMedTilsynsbehov={[...perioderMedTilsynsbehov, ...perioderUtenTilsynsbehov]}
            />
        </div>
    );
};

export default Summary;
