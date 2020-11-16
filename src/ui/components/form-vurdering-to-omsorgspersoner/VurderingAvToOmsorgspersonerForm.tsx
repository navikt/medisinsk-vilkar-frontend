import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Period } from '../../../types/Period';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import { getPeriodDifference } from '../../../util/dateUtils';
import { convertToInternationalPeriod } from '../../../util/formats';
import { required, detErTilsynsbehovPåDatoen, datoenInngårISøknadsperioden } from '../../form/validators';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import TextArea from '../../form/wrappers/TextArea';
import Box, { Margin } from '../box/Box';
import PeriodList, { PeriodListTheme } from '../period-list/PeriodList';
import Tilsynsbehov from '../../../types/Tilsynsbehov';
import SøknadsperiodeContext from '../../context/SøknadsperiodeContext';

interface VurderingAvToOmsorgspersonerFormProps {
    innleggelsesperioder: Period[];
    perioderUtenInnleggelser: Period[];
}

export default ({
    innleggelsesperioder,
    perioderUtenInnleggelser,
}: VurderingAvToOmsorgspersonerFormProps): JSX.Element => {
    const søknadsperiode = React.useContext(SøknadsperiodeContext);
    const { watch, setValue } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const delvisBehovForToOmsorgspersoner = watch(SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER) === Tilsynsbehov.DELER;

    let perioderMedTilsynsbehov = [];
    if (tilsynsbehov === Tilsynsbehov.HELE) {
        perioderMedTilsynsbehov = perioderUtenInnleggelser;
    } else if (tilsynsbehov === Tilsynsbehov.DELER) {
        perioderMedTilsynsbehov = watch(SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE);
    }

    const perioderUtenTilsynsbehov = getPeriodDifference(søknadsperiode, perioderMedTilsynsbehov);

    return (
        <div>
            <Box marginTop={Margin.large}>
                <Systemtittel>Vurdering av to omsorgspersoner</Systemtittel>
                <hr />
            </Box>
            <Box marginTop={Margin.large}>
                <PeriodList periods={[søknadsperiode] || []} title="Søknadsperiode:" theme={PeriodListTheme.CALENDAR} />
            </Box>
            {innleggelsesperioder?.length > 0 && (
                <Box marginTop={Margin.large}>
                    <PeriodList
                        periods={innleggelsesperioder}
                        title="Rett til to omsorgspersoner pga innleggelse:"
                        theme={PeriodListTheme.SUCCESS}
                    />
                </Box>
            )}
            <Box marginTop={Margin.large}>
                <PeriodList
                    periods={perioderMedTilsynsbehov}
                    title="Vurder behov for to omsorgspersoner i perioden barnet skal ha kontinerlig tilsyn og pleie:"
                    theme={PeriodListTheme.WARNING}
                />
            </Box>
            <Box marginTop={Margin.large}>
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
                            perioderValue = getPeriodDifference(søknadsperiode, innleggelsesperioder);
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
                                    minDate: søknadsperiode.fom,
                                    maxDate: søknadsperiode.tom,
                                    invalidDateRanges: perioderUtenTilsynsbehov.map(convertToInternationalPeriod),
                                },
                                validators: {
                                    required,
                                    datoenInngårISøknadsperioden: (dato) =>
                                        datoenInngårISøknadsperioden(dato, søknadsperiode),
                                    detErTilsynsbehovPåDatoen: (dato) =>
                                        detErTilsynsbehovPåDatoen(dato, perioderMedTilsynsbehov),
                                },
                            },
                            toDatepickerProps: {
                                name: 'tom',
                                label: 'Til',
                                limitations: {
                                    minDate: søknadsperiode.fom,
                                    maxDate: søknadsperiode.tom,
                                    invalidDateRanges: perioderUtenTilsynsbehov.map(convertToInternationalPeriod),
                                },
                                validators: {
                                    required,
                                    datoenInngårISøknadsperioden: (dato) =>
                                        datoenInngårISøknadsperioden(dato, søknadsperiode),
                                    detErTilsynsbehovPåDatoen: (dato) =>
                                        detErTilsynsbehovPåDatoen(dato, perioderMedTilsynsbehov),
                                },
                            },
                        }}
                    />
                </Box>
            )}
        </div>
    );
};
