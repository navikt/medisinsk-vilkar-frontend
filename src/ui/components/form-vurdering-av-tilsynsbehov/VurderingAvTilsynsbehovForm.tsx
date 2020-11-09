import React from 'react';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { Period } from '../../../types/Period';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import Tilsynsbehov from '../../../types/Tilsynsbehov';
import { convertToInternationalPeriod } from '../../../util/formats';
import { isDatoInnenforSøknadsperiode, isDatoUtenforInnleggelsesperiodene, required } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import TextArea from '../../form/wrappers/TextArea';
import Box, { Margin } from '../box/Box';
import PeriodList, { PeriodListTheme } from '../period-list/PeriodList';
import { getPeriodDifference } from '../../../util/dateUtils';

interface VurderingAvTilsynsbehovFormProps {
    sykdom: Sykdom;
    innleggelsesperioder: Period[];
    perioderUtenInnleggelser: Period[];
}

export default ({ sykdom, innleggelsesperioder, perioderUtenInnleggelser }: VurderingAvTilsynsbehovFormProps) => {
    const { watch, setValue } = useFormContext();

    const delvisBehovForKontinuerligTilsyn =
        watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN) === Tilsynsbehov.DELER;

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

            <Box marginTop={Margin.large} maxWidth="700px">
                <TextArea
                    name={SykdomFormValue.VURDERING_KONTINUERLIG_TILSYN_OG_PLEIE}
                    helptext="Dersom det er behov for tilsyn og pleie kun i deler av perioden må
                    det komme tydelig frem av vurderingen hvilke perioder det er behov og
                    hvilke det ikke er behov."
                    label={
                        <b>
                            Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge av
                            sykdommen.
                        </b>
                    }
                    validators={{ required }}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <RadioGroupPanel
                    question="Er det behov for kontinuerlig tilsyn og pleie som følge av sykdommen?"
                    name={SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN}
                    radios={[
                        { label: 'Ja, i hele søknadsperioden', value: Tilsynsbehov.HELE },
                        { label: 'Ja, i deler av perioden', value: Tilsynsbehov.DELER },
                        { label: 'Nei', value: Tilsynsbehov.INGEN },
                    ]}
                    validators={{ required }}
                    onChange={(tilsynsbehov: Tilsynsbehov) => {
                        let perioderValue = [{ fom: '', tom: '' }];
                        if (tilsynsbehov === Tilsynsbehov.HELE) {
                            perioderValue = getPeriodDifference(sykdom.periodeTilVurdering, innleggelsesperioder);
                        }
                        if (tilsynsbehov === Tilsynsbehov.INGEN) {
                            perioderValue = [];
                        }
                        setValue(SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE, perioderValue);
                    }}
                />
            </Box>
            {delvisBehovForKontinuerligTilsyn && (
                <Box marginTop={Margin.large}>
                    <PeriodpickerList
                        legend="Oppgi hvilke perioder det er behov for kontinerlig tilsyn og pleie utenom innleggelsesperioden(e)"
                        name={SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
                        periodpickerProps={{
                            fromDatepickerProps: {
                                name: 'fom',
                                label: 'Fra',
                                limitations: {
                                    minDate: sykdom.periodeTilVurdering.fom,
                                    maxDate: sykdom.periodeTilVurdering.tom,
                                    invalidDateRanges: innleggelsesperioder.map(convertToInternationalPeriod),
                                },
                                validators: {
                                    required,
                                    datoInnenforSøknadsperiode: (value) =>
                                        isDatoInnenforSøknadsperiode(value, sykdom?.periodeTilVurdering),
                                    datoUtenforInnleggelsesperiodene: (value) =>
                                        isDatoUtenforInnleggelsesperiodene(value, innleggelsesperioder),
                                },
                            },
                            toDatepickerProps: {
                                name: 'tom',
                                label: 'Til',
                                limitations: {
                                    minDate: sykdom.periodeTilVurdering.fom,
                                    maxDate: sykdom.periodeTilVurdering.tom,
                                    invalidDateRanges: innleggelsesperioder.map(convertToInternationalPeriod),
                                },
                                validators: {
                                    required,
                                    datoInnenforSøknadsperiode: (value) =>
                                        isDatoInnenforSøknadsperiode(value, sykdom?.periodeTilVurdering),
                                    datoUtenforInnleggelsesperiodene: (value) =>
                                        isDatoUtenforInnleggelsesperiodene(value, innleggelsesperioder),
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </>
    );
};
