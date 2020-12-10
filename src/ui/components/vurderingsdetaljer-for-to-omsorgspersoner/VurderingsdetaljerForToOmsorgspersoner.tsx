import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import DetailView from '../detail-view/DetailView';
import LabelledContent from '../labelled-content/LabelledContent';
import Box, { Margin } from '../box/Box';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Dokument from '../../../types/Dokument';
import DokumentLink from '../dokument-link/DokumentLink';
import BasicList from '../basic-list/BasicList';

interface VurderingsdetaljerForToOmsorgspersonerProps {
    vurdering: Vurdering;
    dokumenter: Dokument[];
}

const VurderingsdetaljerForToOmsorgspersoner = ({
    vurdering,
    dokumenter,
}: VurderingsdetaljerForToOmsorgspersonerProps) => {
    const { perioder, begrunnelse, resultat } = vurdering;
    return (
        <DetailView title="Vurdering av to omsorgspersoner">
            <Box marginTop={Margin.medium}>
                <LabelledContent
                    label="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
                    content={
                        <BasicList
                            elements={dokumenter
                                .filter((dokument) => vurdering.dokumenter.includes(dokument.id))
                                .map((dokument) => (
                                    <DokumentLink dokument={dokument} />
                                ))}
                        />
                    }
                />
            </Box>
            <Box marginTop={Margin.medium}>
                <LabelledContent label="Vurdering" content={<span>{begrunnelse}</span>} />
            </Box>
            <Box marginTop={Margin.large}>
                <LabelledContent
                    label="Utfall"
                    content={
                        <span>
                            {resultat === Vurderingsresultat.INNVILGET
                                ? 'Ja, det er behov for to omsorgspersoner'
                                : 'Nei, det er ikke behov for to omsorgspersoner'}
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

export default VurderingsdetaljerForToOmsorgspersoner;
