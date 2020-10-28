import React from 'react';
import Box, { Margin } from '../box/Box';
import { Systemtittel } from 'nav-frontend-typografi';
import PeriodList from '../period-list/PeriodList';
import TextArea from '../../form/wrappers/TextArea';
import SykdomFormValues from '../../../types/SykdomFormState';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import { isDateInPeriod, required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import { convertToInternationalPeriod } from '../../../util/formats';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { Period } from '../../../types/Period';

interface VurderingAvToOmsorgspersonerFormProps {
    sykdom: Sykdom;
    innleggelsesperioder: Period[];
    perioderUtenInnleggelser: Period[];
}

export default ({
    sykdom,
    innleggelsesperioder,
    perioderUtenInnleggelser,
}: VurderingAvToOmsorgspersonerFormProps) => {
    const { watch } = useFormContext();

    const perioderMedTilsynsbehov = watch(
        SykdomFormValues.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE
    );
    const tilsynsbehov = watch(SykdomFormValues.BEHOV_FOR_KONTINUERLIG_TILSYN);

    let perioderMedBehovForTilsynOgPleie = [];
    if (tilsynsbehov === 'hele') {
        perioderMedBehovForTilsynOgPleie = perioderUtenInnleggelser;
    } else if (tilsynsbehov === 'deler') {
        perioderMedBehovForTilsynOgPleie = perioderMedTilsynsbehov;
    }

    const delvisBehovForToOmsorgspersoner =
        watch(SykdomFormValues.BEHOV_FOR_TO_OMSORGSPERSONER) === 'deler';

    return (
        <>
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
                    periods={perioderMedBehovForTilsynOgPleie}
                    title="Vurder behov for to omsorgspersoner i perioden barnet skal ha kontinerlig tilsyn og pleie:"
                />
            </Box>
            <Box marginTop={Margin.large}>
                <TextArea
                    label="Gjør en vurdering av om det er behov for to omsorgspersoner i perioden hvor det er behov for kontinerlig tilsyn og pleie."
                    name={SykdomFormValues.VURDERING_TO_OMSORGSPERSONER}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <RadioGroupPanel
                    question="Er det behov for to omsorgspersoner i perioden hvor vilkår for tilsyn og pleie er oppfylt?"
                    name={SykdomFormValues.BEHOV_FOR_TO_OMSORGSPERSONER}
                    radios={[
                        { label: 'Ja, i hele søknadsperioden', value: 'hele' },
                        { label: 'Ja, i deler av perioden', value: 'deler' },
                        { label: 'Nei', value: 'nei' },
                    ]}
                    validators={{ required }}
                />
            </Box>
            {delvisBehovForToOmsorgspersoner && (
                <Box marginTop={Margin.large}>
                    <PeriodpickerList
                        legend="Oppgi hvilke perioder det er behov for to omsorgspersoner"
                        name={SykdomFormValues.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER}
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
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </>
    );
};
