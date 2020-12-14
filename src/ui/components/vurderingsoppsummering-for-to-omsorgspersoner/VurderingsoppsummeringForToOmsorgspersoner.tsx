import React from 'react';
import { ToOmsorgspersonerVurdering } from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import DetailView from '../detail-view/DetailView';
import LabelledContent from '../labelled-content/LabelledContent';
import Box, { Margin } from '../box/Box';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import Dokument from '../../../types/Dokument';
import DokumentLink from '../dokument-link/DokumentLink';
import BasicList from '../basic-list/BasicList';

interface VurderingsoppsummeringForToOmsorgspersonerProps {
    vurdering: ToOmsorgspersonerVurdering;
    dokumenter: Dokument[];
}

const VurderingsoppsummeringForToOmsorgspersoner = ({
    vurdering,
    dokumenter,
}: VurderingsoppsummeringForToOmsorgspersonerProps) => {
    const { perioder, begrunnelse, resultat } = vurdering;
    return (
        <DetailView title="Vurdering av to omsorgspersoner">
            <Box marginTop={Margin.medium}>
                <LabelledContent
                    label="Hvilke dokumenter er brukt i vurderingen av behov for to omsorgspersoner?"
                    content={
                        <BasicList
                            elements={dokumenter
                                .filter((dokument) => vurdering.dokumenter.includes(dokument))
                                .map((dokument) => (
                                    <DokumentLink dokument={dokument} />
                                ))}
                        />
                    }
                />
            </Box>
            <Box marginTop={Margin.large}>
                <LabelledContent
                    label="Gjør en vurdering av om det er behov for to omsorgspersoner etter § 9-10, andre ledd."
                    content={<span>{begrunnelse}</span>}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <LabelledContent
                    label="Er det behov for to omsorgspersoner?"
                    content={<span>{resultat === Vurderingsresultat.INNVILGET ? 'Ja' : 'Nei'}</span>}
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

export default VurderingsoppsummeringForToOmsorgspersoner;
