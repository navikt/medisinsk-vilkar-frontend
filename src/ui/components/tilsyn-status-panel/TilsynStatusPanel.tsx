import * as React from 'react';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import Box, { Margin } from '../box/Box';
import PeriodList from '../period-list/PeriodList';
import StatusPanel, { StatusPanelTheme } from '../status-panel/StatusPanel';

export enum TilsynStatus {
    BEHOV_FOR_EN = 'behovForEn',
    BEHOV_FOR_TO = 'behovForTo',
    IKKE_BEHOV = 'ikkeBehov',
    INNLAGT = 'innlagt',
}

const statusPanelConfig = {
    [TilsynStatus.BEHOV_FOR_EN]: {
        heading: 'Behov for kontinuerlig tilsyn og pleie',
        theme: StatusPanelTheme.SUCCESS,
        // beskrivelsesRendrer: () =>
    },
    [TilsynStatus.BEHOV_FOR_TO]: {
        heading: 'Behov for kontinuerlig tilsyn og pleie',
        theme: StatusPanelTheme.SUCCESS,
    },
    [TilsynStatus.IKKE_BEHOV]: {
        heading: 'Ikke behov for kontinuerlig tilsyn og pleie',
        theme: StatusPanelTheme.ALERT,
    },
    [TilsynStatus.INNLAGT]: { heading: 'Innlagt på sykehus', theme: StatusPanelTheme.SUCCESS },
};

interface TilsynStatusPanelProps {
    period: Period;
    status: TilsynStatus;
}

const TilsynStatusPanel = ({ period, status }: TilsynStatusPanelProps): JSX.Element => {
    const { heading, theme, beskrivelsesRendrer } = statusPanelConfig[status];
    // const ikkeBehov = theme === StatusPanelTheme.;

    return (
        <StatusPanel heading={heading} theme={theme}>
            <Box marginTop={Margin.small}>{prettifyPeriod(period)}</Box>
            {beskrivelsesRendrer && <Box marginTop={Margin.small}>{beskrivelsesRendrer()}</Box>}
        </StatusPanel>
    );
};

export default TilsynStatusPanel;
