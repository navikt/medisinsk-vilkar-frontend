import moment from 'moment';
import { Element, Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Periode } from '../../types/medisinsk-vilkår/MedisinskVilkår';
import Sykdom from '../../types/medisinsk-vilkår/sykdom';
import { required } from '../form/validators';
import { getResterendePerioder } from '../form/validators/helpers';
import RadioGroupPanel from '../form/wrappers/RadioGroupPanel';
import TextArea from '../form/wrappers/TextArea';
import {
    innleggelsesperioderFieldName,
    vurderingKontinuerligTilsynFieldName,
    vurderingToOmsorgspersonerFieldName,
} from '../MainComponent';
import Box, { Margin } from './Box';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps): JSX.Element => {
    const formMethods = useFormContext();
    const { getValues } = formMethods;

    const innleggelsesperioder = getValues(innleggelsesperioderFieldName);
    const getFormatttedDate = (periode: Periode) => {
        const fomMoment = moment(periode.fom);
        const tomMoment = moment(periode.tom);
        const fomFormatted = fomMoment.format('DD.MM.YYYY');
        const tomFormatted = tomMoment.format('DD.MM.YYYY');

        return <Element tag="span">{`${fomFormatted} - ${tomFormatted}`}</Element>;
    };

    const getSøknadsperiode = () => {
        return (
            <p>
                {`Søknadsperiode: `}
                {getFormatttedDate(sykdom.periodeTilVurdering)}
            </p>
        );
    };

    const getInnleggelsesperioder = (toOmsorgspersoner?: boolean) => {
        if (innleggelsesperioder?.length > 0 && innleggelsesperioder[0].fom !== '') {
            const innleggelsesperiode: Periode = innleggelsesperioder[0];

            const tekst = toOmsorgspersoner
                ? 'Rett til to omsorgspersoner pga innleggelse:'
                : 'Tilsyn og pleie innvilget automatisk pga. innleggelse:';

            return (
                <p>
                    {tekst}
                    <br />
                    {getFormatttedDate(innleggelsesperiode)}
                </p>
            );
        }
        return undefined;
    };

    const getPerioderSomMåVurderes = (toOmsorgspersoner?: boolean) => {
        const perioder = [];
        if (innleggelsesperioder?.length > 0 && innleggelsesperioder[0].fom !== '') {
            const resterendePerioder = getResterendePerioder(
                innleggelsesperioder[0],
                sykdom.periodeTilVurdering
            );
            if (resterendePerioder.length > 0) {
                resterendePerioder.map((periode) => {
                    perioder.push(getFormatttedDate(periode));
                });
            }
        }
        if (perioder.length > 0) {
            const tekst = toOmsorgspersoner
                ? 'Vurder behov for to omsorgspersoner i perioden barnet skal ha kontinerlig tilsyn og pleie:'
                : 'Vurder behov for tilsyn og pleie i perioden hvor barnet ikke er innlagt:';
            return (
                <p>
                    {tekst}
                    <br />
                    {perioder.map((periode, index) => (
                        <span key={index}>
                            {periode}
                            <br />
                        </span>
                    ))}
                </p>
            );
        }
        return undefined;
    };

    return (
        <>
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <Box marginTop={Margin.medium}>
                {getSøknadsperiode()}
                {getInnleggelsesperioder()}
                {getPerioderSomMåVurderes()}
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
            <Box marginTop={Margin.medium}>
                {getSøknadsperiode()}
                {getInnleggelsesperioder(true)}
                {getPerioderSomMåVurderes(true)}
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
