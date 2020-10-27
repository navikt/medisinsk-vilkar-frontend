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
} from '../MainComponent';
import Box, { Margin } from './Box';
import { intersectPeriods } from '../../util/dateUtils';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps): JSX.Element => {
    const formMethods = useFormContext();
    const { getValues } = formMethods;

    const innleggelsesperioder = getValues(innleggelsesperioderFieldName);
    console.log(intersectPeriods(sykdom.periodeTilVurdering, innleggelsesperioder));

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

    const getInnleggelsesperioder = () => {
        if (innleggelsesperioder?.length > 0 && innleggelsesperioder[0].fom !== '') {
            const innleggelsesperiode: Periode = innleggelsesperioder[0];

            return (
                <p>
                    Tilsyn og pleie innvilget automatisk pga. innleggelse:
                    <br />
                    {getFormatttedDate(innleggelsesperiode)}
                </p>
            );
        }
        return undefined;
    };

    const getPerioderSomMåVurderes = () => {
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
            return (
                <p>
                    Vurder behov for tilsyn og pleie i perioden hvor barnet ikke er innlagt:
                    <br />
                    {perioder.map((periode) => (
                        <>
                            {periode}
                            <br />
                        </>
                    ))}
                </p>
            );
        }
        return undefined;
    };

    return (
        <>
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            {getSøknadsperiode()}
            {getInnleggelsesperioder()}
            {getPerioderSomMåVurderes()}
            {/* <Label htmlFor="vurderingKontinuerligTilsyn">
                Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge av
                sykdommen. Dersom det er behov for tilsyn og pleie kun i deler av søknadsperioden må
                det komme tydelig frem av vurderingen hvilke perioder det er behov og hvilke det
                ikke er behov.
            </Label> */}
            <TextArea
                label="Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge av
                sykdommen."
                name={vurderingKontinuerligTilsynFieldName}
            />
            <Box marginTop={Margin.medium}>
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
                {getInnleggelsesperioder()}
            </Box>
        </>
    );
};

export default Vilkårsvurdering;
