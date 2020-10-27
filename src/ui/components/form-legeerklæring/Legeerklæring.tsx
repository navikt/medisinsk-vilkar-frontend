import { DevTool } from '@hookform/devtools';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import {
    isDateAfterOtherDate,
    isDateBeforeOtherDate,
    isDateInPeriod,
    required,
} from '../../form/validators';
import Datepicker from '../../form/wrappers/DatePicker';
import DiagnosekodeSelektor from '../../form/wrappers/DiagnosekodeSelector';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import { innleggelsesperioderFieldName } from '../../MainComponent';
import Box, { Margin } from '../box/Box';
import { LegeerklæringFormInput } from '../../../types/medisinsk-vilkår/LegeerklæringFormInput';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';

interface LegeerklæringProps {
    sykdom: Sykdom;
}

const harDokumentasjonFieldName = 'harDokumentasjon';
const innleggelseDatoFraFieldName = 'innleggelseDatoFra';
const innleggelseDatoTilFieldName = 'innleggelseDatoTil';

const Legeerklæring = ({ sykdom }: LegeerklæringProps): JSX.Element => {
    const formMethods = useFormContext<LegeerklæringFormInput>();
    const { watch, control } = formMethods;

    const harDokumentasjon = watch(harDokumentasjonFieldName);
    const innleggelseDatoFra = watch(innleggelseDatoFraFieldName);
    const innleggelseDatoTil = watch(innleggelseDatoTilFieldName);

    return (
        <>
            <DevTool control={control} />
            <Box marginTop={Margin.medium}>
                <YesOrNoQuestion
                    question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                    name={harDokumentasjonFieldName}
                    validators={{ required }}
                />
            </Box>
            {harDokumentasjon === false && (
                <Box marginTop={Margin.medium}>
                    <RadioGroupPanel
                        question="Hvem har signert legeerklæringen?"
                        name="signertAv"
                        radios={[
                            { label: 'Fastlege', value: 'fastlege' },
                            { label: 'Annen yrkesgruppe', value: 'annenYrkesgruppe' },
                        ]}
                        validators={{ required }}
                    />
                </Box>
            )}
            <Box marginTop={Margin.medium}>
                <Datepicker
                    label="Hvilken dato ble legeerklæringen signert?"
                    name="legeerklæringSignert"
                    validators={{
                        required,
                        isDateInPeriodeTilVurdering: (value) =>
                            isDateInPeriod(value, sykdom?.periodeTilVurdering),
                    }}
                    limitations={{
                        minDate: sykdom.periodeTilVurdering.fom,
                        maxDate: sykdom.periodeTilVurdering.tom,
                    }}
                />
            </Box>
            <Box marginTop={Margin.medium}>
                <DiagnosekodeSelektor
                    name="legeerklæringDiagnose"
                    initialDiagnosekodeValue={sykdom.legeerklæringer[0]?.diagnosekode}
                    // validators={{ required }}
                    label="Oppgi diagnose(r) som er fastsatt"
                />
            </Box>
            <Box marginTop={Margin.medium}>
                <PeriodpickerList
                    legend="Periode for eventuelle innleggelser"
                    name={innleggelsesperioderFieldName}
                    periodpickerProps={{
                        fromDatepickerProps: {
                            name: 'fom',
                            ariaLabel: 'Innleggelsen gjelder fra',
                            limitations: {
                                minDate: sykdom.periodeTilVurdering.fom,
                                maxDate: sykdom.periodeTilVurdering.tom,
                            },
                            validators: {
                                required,
                                isDateInPeriodeTilVurdering: (value) =>
                                    isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                isDateBeforeInnleggelseDatoTil: (value) =>
                                    isDateBeforeOtherDate(value, innleggelseDatoTil),
                            },
                        },
                        toDatepickerProps: {
                            name: 'tom',
                            ariaLabel: 'Innleggelsen gjelder til',
                            limitations: {
                                minDate: sykdom.periodeTilVurdering.fom,
                                maxDate: sykdom.periodeTilVurdering.tom,
                            },
                            validators: {
                                required,
                                isDateInPeriodeTilVurdering: (value) =>
                                    isDateInPeriod(value, sykdom?.periodeTilVurdering),
                                isDateAfterInnleggelseDatoFra: (value) =>
                                    isDateAfterOtherDate(value, innleggelseDatoFra),
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
};

export default Legeerklæring;
