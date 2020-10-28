import * as React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import { useFieldArray, useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { intersectPeriods } from '../../../util/dateUtils';
import { isDateInPeriod, required } from '../../form/validators';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import TextArea from '../../form/wrappers/TextArea';
import {
    innleggelsesperioderFieldName,
    perioderMedBehovForKontinuerligTilsynFieldName,
    vurderingKontinuerligTilsynFieldName,
    vurderingToOmsorgspersonerFieldName,
} from '../../MainComponent';
import Box, { Margin } from '../box/Box';
import PeriodList from '../period-list/PeriodList';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import { convertToInternationalPeriod } from '../../../util/formats';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const behovKontinuerligTilsynFieldName = 'behovKontinuerligTilsyn';

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps): JSX.Element => {
    const formMethods = useFormContext();
    const { getValues, watch, control } = formMethods;

    const innleggelsesperioder = getValues(innleggelsesperioderFieldName);

    const delvisBehovForKontinuerligTilsyn = watch(behovKontinuerligTilsynFieldName) === 'deler';

    const { fields, append, remove } = useFieldArray({
        control,
        name: perioderMedBehovForKontinuerligTilsynFieldName,
    });

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
                <PeriodList periods={[sykdom.periodeTilVurdering] || []} title="Søknadsperiode:" />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={innleggelsesperioder || []}
                    title="Tilsyn og pleie innvilget automatisk pga. innleggelse:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={getPerioderSomMåVurderes()}
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
                    name={behovKontinuerligTilsynFieldName}
                    radios={[
                        { label: 'Ja, i hele søknadsperioden', value: 'hele' },
                        { label: 'Ja, i deler av perioden', value: 'deler' },
                        { label: 'Nei', value: 'nei' },
                    ]}
                    validators={{ required }}
                />
            </Box>
            {delvisBehovForKontinuerligTilsyn && (
                <Box marginTop={Margin.large}>
                    <PeriodpickerList
                        legend="Oppgi hvilke perioder det er behov for kontinerlig tilsyn og pleie utenom innleggelsesperioden"
                        name={perioderMedBehovForKontinuerligTilsynFieldName}
                        periodpickerProps={{
                            fromDatepickerProps: {
                                name: 'fom',
                                ariaLabel: 'Fra',
                                limitations: {
                                    minDate: sykdom.periodeTilVurdering.fom,
                                    maxDate: sykdom.periodeTilVurdering.tom,
                                    invalidDateRanges: innleggelsesperioder.map(
                                        convertToInternationalPeriod
                                    ),
                                },
                                validators: {
                                    required,
                                    isDateInPeriodeTilVurdering: (value) =>
                                        isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                    // isDateBeforeInnleggelseDatoTil: (value) =>
                                    //     isDateBeforeOtherDate(value, innleggelseDatoTil),
                                },
                            },
                            toDatepickerProps: {
                                name: 'tom',
                                ariaLabel: 'Til',
                                limitations: {
                                    minDate: sykdom.periodeTilVurdering.fom,
                                    maxDate: sykdom.periodeTilVurdering.tom,
                                    invalidDateRanges: innleggelsesperioder.map(
                                        convertToInternationalPeriod
                                    ),
                                },
                                validators: {
                                    required,
                                    isDateInPeriodeTilVurdering: (value) =>
                                        isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                    // isDateAfterInnleggelseDatoFra: (value) =>
                                    //     isDateAfterOtherDate(value, innleggelseDatoFra),
                                },
                            },
                        }}
                    />
                </Box>
            )}
            <Box marginTop={Margin.large}>
                <Systemtittel>Vurdering av to omsorgspersoner</Systemtittel>
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList periods={[sykdom.periodeTilVurdering] || []} title="Søknadsperiode:" />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={innleggelsesperioder || []}
                    title="Rett til to omsorgspersoner pga innleggelse:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={getPerioderSomMåVurderes()}
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
