import React from 'react';
import TilsynStatusPanel, {
    TilsynStatusPanelProps,
} from '../status-panel-tilsyn/TilsynStatusPanel';
import moment from 'moment';
import Box, { Margin } from '../box/Box';

interface ListOfTilsynStatusPanelProps {
    perioderMedTilsynsbehov: TilsynStatusPanelProps[];
}

function sortByPeriodFom(perioderMedTilsynsbehov: TilsynStatusPanelProps[]) {
    return perioderMedTilsynsbehov.sort((firstEl, secondEl) => {
        const firstFom = moment(firstEl.period.fom);
        const secondFom = moment(secondEl.period.fom);
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
            {sortByPeriodFom(perioderMedTilsynsbehov).map(({ period, status }, index) => {
                const statusEl = <TilsynStatusPanel period={period} status={status} />;
                if (index > 0) {
                    return <Box marginTop={Margin.medium}>{statusEl}</Box>;
                }
                return statusEl;
            })}
        </Box>
    );
};

export default ListOfTilsynStatusPanel;
