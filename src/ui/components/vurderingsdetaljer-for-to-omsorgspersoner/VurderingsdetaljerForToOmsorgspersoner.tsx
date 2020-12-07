import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { prettifyPeriod } from '../../../util/formats';
import DetailView from '../detail-view/DetailView';
import styles from './vurderingsdetaljerForToOmsorgspersoner.less';
import LabelledContent from '../labelled-content/LabelledContent';
import Box, { Margin } from '../box/Box';
import Vurderingsresultat from '../../../types/Vurderingsresultat';

interface VurderingsdetaljerForToOmsorgspersonerProps {
    vurdering: Vurdering;
}

const VurderingsdetaljerForToOmsorgspersoner = ({
    vurdering: { perioder, begrunnelse, resultat },
}: VurderingsdetaljerForToOmsorgspersonerProps) => {
    return (
        <DetailView title="Vurdering av to omsorgspersoner">
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
