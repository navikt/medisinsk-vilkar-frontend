import React from 'react';
import moment from 'moment';
import TilsynStatusPanel from '../status-panel-tilsyn/TilsynStatusPanel';
import Box, { Margin } from '../box/Box';
import PeriodeMedTilsynsbehov from '../../../types/PeriodeMedTilsynsbehov';

interface ListOfTilsynStatusPanelProps {
    perioderMedTilsynsbehov: PeriodeMedTilsynsbehov[];
}

function sortByPeriodFom(perioderMedTilsynsbehov: PeriodeMedTilsynsbehov[]) {
    return perioderMedTilsynsbehov.sort((firstEl, secondEl) => {
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

const ListOfTilsynStatusPanel = ({ perioderMedTilsynsbehov }: ListOfTilsynStatusPanelProps) => {
    return (
        <Box marginTop={Margin.medium}>
            {sortByPeriodFom(perioderMedTilsynsbehov).map(({ periode, grad }, index) => {
                const statusEl = <TilsynStatusPanel periode={periode} grad={grad} />;
                if (index > 0) {
                    return <Box marginTop={Margin.medium}>{statusEl}</Box>;
                }
                return statusEl;
            })}
        </Box>
    );
};

export default ListOfTilsynStatusPanel;
