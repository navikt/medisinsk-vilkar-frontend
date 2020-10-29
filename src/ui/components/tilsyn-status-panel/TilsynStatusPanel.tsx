import * as React from 'react';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import Box, { Margin } from '../box/Box';
import StatusPanel, { StatusPanelTheme } from '../status-panel/StatusPanel';
import OnePersonIcon from '../icons/OnePersonIcon';
import TwoPersonsIcon from '../icons/TwoPersonsIcon';

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
        description: 'Det er kun behov for én omsorgspersoner denne perioden',
        iconRenderer: () => <OnePersonIcon />,
    },
    [TilsynStatus.BEHOV_FOR_TO]: {
        heading: 'Behov for kontinuerlig tilsyn og pleie',
        theme: StatusPanelTheme.SUCCESS,
        description: 'Det er behov for to omsorgspersoner denne perioden',
        iconRenderer: () => <TwoPersonsIcon />,
    },
    [TilsynStatus.INNLAGT]: {
        heading: 'Innlagt på sykehus',
        theme: StatusPanelTheme.SUCCESS,
        description: 'Det er behov for to omsorgspersoner denne perioden',
        iconRenderer: () => <TwoPersonsIcon />,
    },
    [TilsynStatus.IKKE_BEHOV]: {
        heading: 'Ikke behov for kontinuerlig tilsyn og pleie',
        theme: StatusPanelTheme.ALERT,
    },
};

interface TilsynStatusPanelProps {
    period: Period;
    status: TilsynStatus;
}

const Tilsynsbeskrivelse = ({ status }) => (
    <div style={{ display: 'flex' }}>
        {statusPanelConfig[status].iconRenderer()}
        {statusPanelConfig[status].description}
    </div>
);

const TilsynStatusPanel = ({ period, status }: TilsynStatusPanelProps): JSX.Element => {
    const { heading, theme } = statusPanelConfig[status];

    const harTilsynsbehov = [
        TilsynStatus.BEHOV_FOR_EN,
        TilsynStatus.BEHOV_FOR_TO,
        TilsynStatus.INNLAGT,
    ].includes(status);

    return (
        <StatusPanel heading={heading} theme={theme}>
            <Box marginTop={Margin.small}>{prettifyPeriod(period)}</Box>
            {harTilsynsbehov && (
                <Box marginTop={Margin.small}>
                    <Tilsynsbeskrivelse status={status} />
                </Box>
            )}
        </StatusPanel>
    );
};

export default TilsynStatusPanel;
