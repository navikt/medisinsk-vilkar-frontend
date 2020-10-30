import React from 'react';
import Box, { Margin } from '../box/Box';
import PeriodList, { PeriodListTheme } from '../period-list/PeriodList';
import TextArea from '../../form/wrappers/TextArea';
import SykdomFormValues from '../../../types/SykdomFormState';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import { isDateInPeriod, required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import { convertToInternationalPeriod } from '../../../util/formats';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { Period } from '../../../types/Period';
import Tilsynsbehov from '../../../types/Tilsynsbehov';

interface VurderingAvTilsynsbehovFormProps {
    sykdom: Sykdom;
    innleggelsesperioder: Period[];
    perioderUtenInnleggelser: Period[];
}

export default ({
    sykdom,
    innleggelsesperioder,
    perioderUtenInnleggelser,
}: VurderingAvTilsynsbehovFormProps) => {
    const { watch } = useFormContext();

    const delvisBehovForKontinuerligTilsyn =
        watch(SykdomFormValues.BEHOV_FOR_KONTINUERLIG_TILSYN) === Tilsynsbehov.DELER;

    return (
        <>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={[sykdom.periodeTilVurdering] || []}
                    title="Søknadsperiode:"
                    theme={PeriodListTheme.CALENDAR}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={innleggelsesperioder || []}
                    title="Tilsyn og pleie innvilget automatisk pga. innleggelse:"
                    theme={PeriodListTheme.SUCCESS}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={perioderUtenInnleggelser}
                    title="Vurder behov for tilsyn og pleie i perioden hvor barnet ikke er innlagt:"
                    theme={PeriodListTheme.WARNING}
                />
            </Box>

            <Box marginTop={Margin.large}>
                <TextArea
                    label={
                        <label>
                            <b>
                                Gjør en vurdering av om det er behov for kontinuerlig tilsyn og
                                pleie som følge av sykdommen.
                            </b>
                            &nbsp;Dersom det er behov for tilsyn og pleie kun i deler av perioden må
                            det komme tydelig frem av vurderingen hvilke perioder det er behov og
                            hvilke det ikke er behov.
                        </label>
                    }
                    name={SykdomFormValues.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <RadioGroupPanel
                    question="Er det behov for kontinuerlig tilsyn og pleie som følge av sykdommen?"
                    name={SykdomFormValues.BEHOV_FOR_KONTINUERLIG_TILSYN}
                    radios={[
                        { label: 'Ja, i hele søknadsperioden', value: Tilsynsbehov.HELE },
                        { label: 'Ja, i deler av perioden', value: Tilsynsbehov.DELER },
                        { label: 'Nei', value: Tilsynsbehov.INGEN },
                    ]}
                    validators={{ required }}
                />
            </Box>
            {delvisBehovForKontinuerligTilsyn && (
                <Box marginTop={Margin.large}>
                    <PeriodpickerList
                        legend="Oppgi hvilke perioder det er behov for kontinerlig tilsyn og pleie utenom innleggelsesperioden(e)"
                        name={SykdomFormValues.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
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
