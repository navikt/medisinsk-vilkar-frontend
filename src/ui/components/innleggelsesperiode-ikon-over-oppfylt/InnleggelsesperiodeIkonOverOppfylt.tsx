import { IndicatorWithOverlay } from '@navikt/k9-react-components';
import React from 'react';
import InstitutionIcon from '../icons/InstitutionIcon';
import GreenCheckIconFilled from '../icons/GreenCheckIconFilled';

const InnleggelsesperiodeIkonOverOppfylt = () => {
    return (
        <IndicatorWithOverlay
            indicatorRenderer={() => <GreenCheckIconFilled />}
            overlayRenderer={() => <InstitutionIcon />}
        />
    );
};

export default InnleggelsesperiodeIkonOverOppfylt;
