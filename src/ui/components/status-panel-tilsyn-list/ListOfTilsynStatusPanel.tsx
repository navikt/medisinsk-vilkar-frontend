import React from 'react';
import moment from 'moment';
import TilsynStatusPanel from '../status-panel-tilsyn/TilsynStatusPanel';
import Box, { Margin } from '../box/Box';
import PeriodeMedGradAvTilsynsbehov from '../../../types/PeriodeMedGradAvTilsynsbehov';

interface ListOfTilsynStatusPanelProps {
    perioderMedGradAvTilsynsbehov: PeriodeMedGradAvTilsynsbehov[];
}

function sortByPeriodFom(perioder: PeriodeMedGradAvTilsynsbehov[]) {
    return perioder.sort((firstEl, secondEl) => {
        const firstFom = moment(firstEl.periode.fom);
        const secondFom = moment(secondEl.periode.fom);
        if (firstFom.isBefore(secondFom)) {
            return -1;
        } else if (secondFom.isBefore(firstFom)) {
            return 1;
        }
        return 0;
    });
}

function renderPaneler(perioderMedGradAvTilsynsbehov: PeriodeMedGradAvTilsynsbehov[]) {
    return perioderMedGradAvTilsynsbehov.map(({ periode, grad }, index) => {
        const statusEl = <TilsynStatusPanel periode={periode} grad={grad} />;
        if (index > 0) {
            return <Box marginTop={Margin.medium}>{statusEl}</Box>;
        }
        return statusEl;
    });
}

const ListOfTilsynStatusPanel = ({ perioderMedGradAvTilsynsbehov }: ListOfTilsynStatusPanelProps) => {
    const sortertePerioder = sortByPeriodFom(perioderMedGradAvTilsynsbehov);
    return <Box marginTop={Margin.medium}>{renderPaneler(sortertePerioder)}</Box>;
};

export default ListOfTilsynStatusPanel;
