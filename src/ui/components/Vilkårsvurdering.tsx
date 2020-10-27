import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';
import { intersectPeriods } from '../../util/dateUtils';
import { required } from '../form/validators';
import RadioGroupPanel from '../form/wrappers/RadioGroupPanel';
import TextArea from '../form/wrappers/TextArea';
import {
    innleggelsesperioderFieldName,
    vurderingKontinuerligTilsynFieldName,
    vurderingToOmsorgspersonerFieldName,
} from '../MainComponent';
import Box, { Margin } from './Box';
import Periodevisning from './Periodevisning';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps): JSX.Element => {
    const formMethods = useFormContext();
    const { getValues } = formMethods;

    const innleggelsesperioder = getValues(innleggelsesperioderFieldName);

    const getPerioderSomMåVurderes = () => {
        const perioder = [];
        if (innleggelsesperioder?.length > 0 && innleggelsesperioder[0].fom !== '') {
            const resterendePerioder = intersectPeriods(
                sykdom.periodeTilVurdering,
                innleggelsesperioder
            );
            if (resterendePerioder.length > 0) {
                resterendePerioder.map((periode) =>
                    perioder.push({ fom: periode[0], tom: periode[periode.length - 1] })
                );
            }
        }
        return perioder;
    };

    return (
        <>
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <Box marginTop={Margin.large}>
                <Periodevisning
                    perioder={[sykdom.periodeTilVurdering] || []}
                    title="Søknadsperiode:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <Periodevisning
                    perioder={innleggelsesperioder || []}
                    title="Tilsyn og pleie innvilget automatisk pga. innleggelse:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <Periodevisning
                    perioder={getPerioderSomMåVurderes()}
                    title="Vurder behov for tilsyn og pleie i perioden hvor barnet ikke er innlagt:"
                />
            </Box>

            <Box marginTop={Margin.large}>
                <TextArea
                    label="Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge av
                sykdommen."
                    name={vurderingKontinuerligTilsynFieldName}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <RadioGroupPanel
                    question="Er det behov for kontinuerlig tilsyn og pleie som følge av sykdommen?"
                    name="behovKontinuerligTilsyn"
                    radios={[
                        { label: 'Ja, i hele søknadsperioden', value: 'hele' },
                        { label: 'Ja, i deler av perioden', value: 'deler' },
                        { label: 'Nei', value: 'nei' },
                    ]}
                    validators={{ required }}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <Systemtittel>Vurdering av to omsorgspersoner</Systemtittel>
            </Box>
            <Box marginTop={Margin.large}>
                <Periodevisning
                    perioder={[sykdom.periodeTilVurdering] || []}
                    title="Søknadsperiode:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <Periodevisning
                    perioder={innleggelsesperioder || []}
                    title="Rett til to omsorgspersoner pga innleggelse:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <Periodevisning
                    perioder={getPerioderSomMåVurderes()}
                    title="Vurder behov for tilsyn og pleie i perioden hvor barnet ikke er innlagt:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <TextArea
                    label="Gjør en vurdering av om det er behov for to omsorgspersoner i perioden hvor det er behov for kontinerlig tilsyn og pleie."
                    name={vurderingToOmsorgspersonerFieldName}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <RadioGroupPanel
                    question="Er det behov for to omsorgspersoner i perioden hvor vilkår for tilsyn og pleie er oppfylt?"
                    name="behovToOmsorgspersoner"
                    radios={[
                        { label: 'Ja, i hele søknadsperioden', value: 'hele' },
                        { label: 'Ja, i deler av perioden', value: 'deler' },
                        { label: 'Nei', value: 'nei' },
                    ]}
                    validators={{ required }}
                />
            </Box>
        </>
    );
};

export default Vilkårsvurdering;
