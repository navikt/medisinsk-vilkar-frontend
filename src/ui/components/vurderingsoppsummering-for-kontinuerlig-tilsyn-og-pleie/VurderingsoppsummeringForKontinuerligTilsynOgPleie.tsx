import React from 'react';
import { prettifyPeriod, prettifyPeriodList } from '../../../util/formats';
import Box, { Margin } from '../box/Box';
import Vurdering from '../../../types/Vurdering';
import LabelledContent from '../labelled-content/LabelledContent';
import BasicList from '../basic-list/BasicList';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForKontinuerligTilsynOgPleieProps {
    vurdering: Vurdering;
    redigerVurdering: () => void;
}

const VurderingsoppsummeringForKontinuerligTilsynOgPleie = ({
    vurdering,
    redigerVurdering,
}: VurderingsoppsummeringForKontinuerligTilsynOgPleieProps) => {
    const gjeldendeVurdering = vurdering.versjoner[0];
    const { dokumenter, perioder, tekst, resultat } = gjeldendeVurdering;
    const erInnleggelse = vurdering.erInnleggelsesperiode;
    return (
        <DetailViewVurdering
            title="Vurdering av tilsyn og pleie"
            perioder={perioder}
            redigerVurdering={!erInnleggelse ? redigerVurdering : null}
        >
            <Box marginTop={Margin.large}>
                {erInnleggelse && <DekketAvInnleggelsesperiodeMelding />}
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
            </Box>
        </DetailViewVurdering>
    );
};

export default VurderingsoppsummeringForKontinuerligTilsynOgPleie;
