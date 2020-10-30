import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { Period } from '../../../types/Period';
import SykdomFormValues from '../../../types/SykdomFormState';
import { intersectPeriods } from '../../../util/dateUtils';
import { convertToInternationalPeriod } from '../../../util/formats';
import { isDateInPeriod, required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import TextArea from '../../form/wrappers/TextArea';
import Box, { Margin } from '../box/Box';
import PeriodList, { PeriodListTheme } from '../period-list/PeriodList';
import Tilsynsbehov from '../../../types/Tilsynsbehov';

interface VurderingAvToOmsorgspersonerFormProps {
    sykdom: Sykdom;
    innleggelsesperioder: Period[];
    perioderUtenInnleggelser: Period[];
}

export default ({
    sykdom,
    innleggelsesperioder,
    perioderUtenInnleggelser,
}: VurderingAvToOmsorgspersonerFormProps): JSX.Element => {
    const { watch } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValues.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const delvisBehovForToOmsorgspersoner =
        watch(SykdomFormValues.BEHOV_FOR_TO_OMSORGSPERSONER) === Tilsynsbehov.DELER;

    let perioderMedTilsynsbehov = [];
    if (tilsynsbehov === Tilsynsbehov.HELE) {
        perioderMedTilsynsbehov = perioderUtenInnleggelser;
    } else if (tilsynsbehov === Tilsynsbehov.DELER) {
        perioderMedTilsynsbehov = watch(
            SykdomFormValues.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE
        );
    }

    const perioderUtenTilsynsbehov = intersectPeriods(
        sykdom.periodeTilVurdering,
        perioderMedTilsynsbehov
    );

    return (
        <>
            <Box marginTop={Margin.large}>
                <Systemtittel>Vurdering av to omsorgspersoner</Systemtittel>
            </Box>
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
                    title="Rett til to omsorgspersoner pga innleggelse:"
                    theme={PeriodListTheme.SUCCESS}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={perioderMedTilsynsbehov}
                    title="Vurder behov for to omsorgspersoner i perioden barnet skal ha kontinerlig tilsyn og pleie:"
                    theme={PeriodListTheme.WARNING}
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
                                    invalidDateRanges: perioderUtenTilsynsbehov.map(
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
                                    invalidDateRanges: perioderUtenTilsynsbehov.map(
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
