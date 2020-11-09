import { Systemtittel } from 'nav-frontend-typografi';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { Period } from '../../../types/Period';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import { getPeriodDifference } from '../../../util/dateUtils';
import { convertToInternationalPeriod } from '../../../util/formats';
import { isDatoUtenforPeriodeUtenTilsynsbehov, isDatoInnenforSøknadsperiode, required } from '../../form/validators';
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
    useEffect(() => {
        document.getElementById('vurderingAvToOmsorgspersoner').scrollIntoView({ behavior: 'smooth' });
    }, []);

    const { watch, setValue } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const delvisBehovForToOmsorgspersoner = watch(SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER) === Tilsynsbehov.DELER;

    let perioderMedTilsynsbehov = [];
    if (tilsynsbehov === Tilsynsbehov.HELE) {
        perioderMedTilsynsbehov = perioderUtenInnleggelser;
    } else if (tilsynsbehov === Tilsynsbehov.DELER) {
        perioderMedTilsynsbehov = watch(SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE);
    }

    const perioderUtenTilsynsbehov = getPeriodDifference(sykdom.periodeTilVurdering, perioderMedTilsynsbehov);

    return (
        <div id="vurderingAvToOmsorgspersoner">
            <Box marginTop={Margin.large}>
                <Systemtittel>Vurdering av to omsorgspersoner</Systemtittel>
                <hr />
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
            <Box marginTop={Margin.large} maxWidth="700px">
                <TextArea
                    name={SykdomFormValue.VURDERING_TO_OMSORGSPERSONER}
                    helptext="Dersom det er behov for to omsorgsperoner deler av perioden,  må det komme tydelig frem av vurderingen hvilke perioder det er behov og hvilke det ikke er behov."
                    label={
                        <b>
                            Gjør en vurdering av om det er behov for to omsorgspersoner i perioden hvor det er behov for
                            kontinerlig tilsyn og pleie.
                        </b>
                    }
                    validators={{ required }}
                />
            </Box>
            <Box marginTop={Margin.large}>
                <RadioGroupPanel
                    question="Er det behov for to omsorgspersoner i perioden hvor vilkår for tilsyn og pleie er oppfylt?"
                    name={SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER}
                    radios={[
                        {
                            label: 'Ja, i hele perioden med tilsynsbehov',
                            value: 'hele',
                        },
                        {
                            label: 'Ja, i deler av perioden med tilsynsbehov',
                            value: 'deler',
                        },
                        { label: 'Nei', value: 'nei' },
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
                        setValue(SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER, perioderValue);
                    }}
                />
            </Box>
            {delvisBehovForToOmsorgspersoner && (
                <Box marginTop={Margin.large}>
                    <PeriodpickerList
                        legend="Oppgi hvilke perioder det er behov for to omsorgspersoner"
                        name={SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER}
                        periodpickerProps={{
                            fromDatepickerProps: {
                                name: 'fom',
                                label: 'Fra',
                                limitations: {
                                    minDate: sykdom.periodeTilVurdering.fom,
                                    maxDate: sykdom.periodeTilVurdering.tom,
                                    invalidDateRanges: perioderUtenTilsynsbehov.map(convertToInternationalPeriod),
                                },
                                validators: {
                                    required,
                                    datoInnenforSøknadsperiode: (value) =>
                                        isDatoInnenforSøknadsperiode(value, sykdom?.periodeTilVurdering),
                                    datoUtenforUgyldigeDatoer: (value) =>
                                        isDatoUtenforPeriodeUtenTilsynsbehov(value, perioderUtenTilsynsbehov),
                                },
                            },
                            toDatepickerProps: {
                                name: 'tom',
                                label: 'Til',
                                limitations: {
                                    minDate: sykdom.periodeTilVurdering.fom,
                                    maxDate: sykdom.periodeTilVurdering.tom,
                                    invalidDateRanges: perioderUtenTilsynsbehov.map(convertToInternationalPeriod),
                                },
                                validators: {
                                    required,
                                    datoInnenforSøknadsperiode: (value) =>
                                        isDatoInnenforSøknadsperiode(value, sykdom?.periodeTilVurdering),
                                    datoUtenforUgyldigeDatoer: (value) =>
                                        isDatoUtenforPeriodeUtenTilsynsbehov(value, perioderUtenTilsynsbehov),
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </div>
    );
};
