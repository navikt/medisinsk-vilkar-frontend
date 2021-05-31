import React from 'react';
import { Period, prettifyPeriodList } from '@navikt/k9-period-utils';
import { Normaltekst } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import InfoPanel from '../info-panel/InfoPanel';

interface OverlappendeSøknadsperiodePanelProps {
    onProgressButtonClick: () => void;
    overlappendeVurderingsperioder: Period[];
}

const OverlappendeSøknadsperiodePanel = ({
    onProgressButtonClick,
    overlappendeVurderingsperioder,
}: OverlappendeSøknadsperiodePanelProps) => (
    <InfoPanel type="warning">
        <Normaltekst>
            {`Søknadsperioden overlapper med en eller flere tidligere vurderte perioder
                (${prettifyPeriodList(
                    overlappendeVurderingsperioder
                )}). Vurder om det er grunnlag for å gjøre en ny vurdering for
                denne perioden.`}
        </Normaltekst>
        <Knapp type="hoved" mini htmlType="button" onClick={onProgressButtonClick} style={{ marginTop: '1rem' }}>
            Utført, eventuelle nye vurderinger er registrert
        </Knapp>
    </InfoPanel>
);

export default OverlappendeSøknadsperiodePanel;
