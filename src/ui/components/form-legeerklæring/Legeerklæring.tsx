import { DevTool } from '@hookform/devtools';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { LegeerklæringFormInput } from '../../../types/medisinsk-vilkår/LegeerklæringFormInput';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import SykdomFormValues from '../../../types/SykdomFormState';
import { isDateInPeriod, required } from '../../form/validators';
import Datepicker from '../../form/wrappers/Datepicker';
import DiagnosekodeSelektor from '../../form/wrappers/DiagnosekodeSelector';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import Box, { Margin } from '../box/Box';

interface LegeerklæringProps {
    sykdom: Sykdom;
}

const Legeerklæring = ({ sykdom }: LegeerklæringProps): JSX.Element => {
    const formMethods = useFormContext<LegeerklæringFormInput>();
    const { watch, control } = formMethods;

    const harDokumentasjon = watch(SykdomFormValues.HAR_DOKUMENTASJON);

    return (
        <>
            {process.env.NODE_ENV === 'development' && <DevTool control={control} />}
            <Box marginTop={Margin.medium}>
                <YesOrNoQuestion
                    question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i speisalisthelsetjenesten?"
                    name={SykdomFormValues.HAR_DOKUMENTASJON}
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
                    name={SykdomFormValues.INNLEGGELSESPERIODER}
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
                            },
                        },
                    }}
                />
            </Box>
        </>
    );
};

export default Legeerklæring;
