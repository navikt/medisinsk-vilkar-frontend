import React from 'react';
import Vurdering from '../../../types/Vurdering';
import InteractiveList from '../interactive-list/InteractiveList';
import Vurderingsperiode from '../vurderingsperiode/Vurderingsperiode';
import { sortPeriodsByFomDate } from '../../../util/periodUtils';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';

interface VurderingsvelgerProps {
    vurderinger: Vurdering[];
    onActiveVurderingChange: (vurdering: Vurdering) => void;
}

interface PeriodeMedTilhørendeVurdering {
    periode: Period;
    vurdering: Vurdering;
}

function sammenstillVurderingsperioder(vurderinger: Vurdering[]): PeriodeMedTilhørendeVurdering[] {
    return vurderinger
        .map((vurdering) => vurdering.perioder.map((periode) => ({ periode, vurdering })))
        .flat()
        .sort((p1, p2) => sortPeriodsByFomDate(p1.periode, p2.periode));
}

function configureInteractiveListElement({ periode, vurdering }: PeriodeMedTilhørendeVurdering, selectCallback) {
    return {
        contentRenderer: () => <Vurderingsperiode periode={periode} resultat={vurdering.resultat} />,
        vurdering,
        onClick: (element) => selectCallback(element.vurdering),
        key: prettifyPeriod(periode),
    };
}

const Vurderingsvelger = ({ vurderinger, onActiveVurderingChange }: VurderingsvelgerProps) => {
    const vurderingsperioder = sammenstillVurderingsperioder(vurderinger);
    return (
        <InteractiveList
            elements={vurderingsperioder.map((vurderingsperiode) =>
                configureInteractiveListElement(vurderingsperiode, onActiveVurderingChange)
            )}
        />
    );
};

export default Vurderingsvelger;
