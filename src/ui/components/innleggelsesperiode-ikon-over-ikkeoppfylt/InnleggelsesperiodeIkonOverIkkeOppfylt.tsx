import { IndicatorWithOverlay } from '@navikt/k9-react-components';
import React from 'react';
import InstitutionIcon from '../icons/InstitutionIcon';
import RedCrossIconFilled from '../icons/RedCrossIconFilled';

const InnleggelsesperiodeIkonOverIkkeOppfylt = () => {
    return (
        <IndicatorWithOverlay
            indicatorRenderer={() => <RedCrossIconFilled />}
            overlayRenderer={() => <InstitutionIcon />}
        />
    );
};

export default InnleggelsesperiodeIkonOverIkkeOppfylt;
