import React from 'react';
import { prettifyPeriod, prettifyPeriodList } from '../../../util/formats';
import DetailView from '../detail-view/DetailView';
import LabelledContent from '../labelled-content/LabelledContent';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Box, { Margin } from '../box/Box';
import BasicList from '../basic-list/BasicList';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurdering from '../../../types/Vurdering';

interface VurderingsoppsummeringForKontinuerligTilsynOgPleieProps {
    vurdering: Vurdering;
}

const VurderingsoppsummeringForKontinuerligTilsynOgPleie = ({
    vurdering,
}: VurderingsoppsummeringForKontinuerligTilsynOgPleieProps) => {
    const gjeldendeVurdering = vurdering.versjoner[0];
    const { perioder, tekst, resultat, dokumenter } = gjeldendeVurdering;

    return (
        <DetailView
            title="Vurdering av behov for kontinuerlig tilsyn og pleie"
            renderNextToTitle={() => prettifyPeriodList(perioder)}
        >
            <Box marginTop={Margin.medium}>
                <LabelledContent
                    label="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
                    content={
                        <Box marginTop={Margin.medium}>
                            <BasicList
                                elements={dokumenter.map((dokument) => (
                                    <DokumentLink dokument={dokument} visDokumentIkon />
                                ))}
                            />
                        </Box>
                    }
                />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent
                    label="Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen etter § 9-10, første ledd."
                    content={<span>{tekst}</span>}
                />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent
                    label="Er det behov for tilsyn og pleie?"
                    content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
                />
            </Box>
            <Box marginTop={Margin.xLarge}>
                <LabelledContent
                    label={resultat === Vurderingsresultat.OPPFYLT ? 'Perioder innvilget' : 'Perioder avslått'}
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

export default VurderingsoppsummeringForKontinuerligTilsynOgPleie;
