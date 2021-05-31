import React from 'react';
import Vurdering from '../../../types/Vurdering';
import Box, { Margin } from '../box/Box';
import LabelledContent from '../labelled-content/LabelledContent';
import BasicList from '../basic-list/BasicList';
import DokumentLink from '../dokument-link/DokumentLink';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DekketAvInnleggelsesperiodeMelding from '../dekket-av-innleggelsesperiode-melding/DekketAvInnleggelsesperiodeMelding';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';

interface VurderingsoppsummeringForToOmsorgspersonerProps {
    vurdering: Vurdering;
    redigerVurdering: () => void;
}

const VurderingsoppsummeringForToOmsorgspersoner = ({
    vurdering,
    redigerVurdering,
}: VurderingsoppsummeringForToOmsorgspersonerProps) => {
    const gjeldendeVurdering = vurdering.versjoner[0];
    const { resultat, tekst, dokumenter, perioder } = gjeldendeVurdering;
    const erInnleggelse = vurdering.erInnleggelsesperiode;
    return (
        <DetailViewVurdering
            title="Vurdering av to omsorgspersoner"
            perioder={perioder}
            redigerVurdering={!erInnleggelse ? redigerVurdering : null}
        >
            <Box marginTop={Margin.large}>
                {erInnleggelse && <DekketAvInnleggelsesperiodeMelding />}
                <Box marginTop={Margin.medium}>
                    <LabelledContent
                        label="Hvilke dokumenter er brukt i vurderingen av behov for to omsorgspersoner samtidig?"
                        content={
                            <BasicList
                                elements={dokumenter
                                    .filter(({ benyttet }) => benyttet)
                                    .map((dokument) => (
                                        <DokumentLink dokument={dokument} visDokumentIkon />
                                    ))}
                            />
                        }
                    />
                </Box>
                <Box marginTop={Margin.xLarge}>
                    <LabelledContent
                        label="Gjør en vurdering av om det er behov for to omsorgspersoner samtidig etter § 9-10, andre ledd."
                        content={<span>{tekst}</span>}
                    />
                </Box>
                <Box marginTop={Margin.xLarge}>
                    <LabelledContent
                        label="Er det behov for to omsorgspersoner samtidig?"
                        content={<span>{resultat === Vurderingsresultat.OPPFYLT ? 'Ja' : 'Nei'}</span>}
                    />
                </Box>
                <Box marginTop={Margin.xLarge}>
                    <LabelledContent
                        label="Perioder vurdert"
                        content={
                            <ul style={{ margin: 0, listStyleType: 'none', padding: 0 }}>
                                {perioder.map((period, i) => (
                                    <li key={`${i}`}>{period.prettifyPeriod()}</li>
                                ))}
                            </ul>
                        }
                    />
                </Box>
            </Box>
        </DetailViewVurdering>
    );
};

export default VurderingsoppsummeringForToOmsorgspersoner;
