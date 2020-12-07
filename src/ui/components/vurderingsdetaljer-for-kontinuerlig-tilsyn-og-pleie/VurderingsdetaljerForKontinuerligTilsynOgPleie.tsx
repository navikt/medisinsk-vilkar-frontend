import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import DetailView from '../detail-view/DetailView';
import LabelledContent from '../labelled-content/LabelledContent';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Box, { Margin } from '../box/Box';

interface VurderingsdetaljerForKontinuerligTilsynOgPleieProps {
    vurdering: Vurdering;
}

const VurderingsdetaljerForKontinuerligTilsynOgPleie = ({
    vurdering: { perioder, begrunnelse, resultat },
}: VurderingsdetaljerForKontinuerligTilsynOgPleieProps) => {
    return (
        <DetailView title="Vurdering av behov for kontinuerlig tilsyn og pleie">
            <Box marginTop={Margin.medium}>
                <LabelledContent label="Vurdering" content={<span>{begrunnelse}</span>} />
            </Box>
            <Box marginTop={Margin.large}>
                <LabelledContent
                    label="Utfall"
                    content={
                        <span>
                            {resultat === Vurderingsresultat.INNVILGET
                                ? 'Ja, det er behov for kontinuerlig tilsyn og pleie'
                                : 'Nei, det er ikke behov for kontinuerlig tilsyn og pleie'}
                        </span>
                    }
                />
            </Box>
            <Box marginTop={Margin.large}>
                <LabelledContent
                    label="Perioder vurdert"
                    content={
                        <ul style={{ margin: 0, listStyleType: 'none', padding: 0 }}>
                            {perioder.map((periode, i) => (
                                <li key={`${i}`}>{prettifyPeriod(periode)}</li>
                            ))}
                        </ul>
                    }
                />
            </Box>
        </DetailView>
    );
};

export default VurderingsdetaljerForKontinuerligTilsynOgPleie;
