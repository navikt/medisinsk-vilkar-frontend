import React from 'react';
import { useFormContext } from 'react-hook-form';
import { LegeerklæringFormInput } from '../../../types/medisinsk-vilkår/LegeerklæringFormInput';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import { SykdomFormValue } from '../../../types/SykdomFormState';
import { datoenInngårISøknadsperioden, required } from '../../form/validators';
import DiagnosekodeSelektor from '../../form/wrappers/DiagnosekodeSelector';
import PeriodpickerList from '../../form/wrappers/PeriodpickerList';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import Box, { Margin } from '../box/Box';
import Step from '../step/Step';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Hovedknapp } from 'nav-frontend-knapper';
import Lenke from 'nav-frontend-lenker';
import styles from './legeerklæringFormStyles.less';
import Form from '../form/Form';
import SøknadsperiodeContext from '../../context/SøknadsperiodeContext';

interface LegeerklæringFormProps {
    onSubmit: () => void;
}

const LegeerklæringForm = ({ onSubmit }: LegeerklæringFormProps): JSX.Element => {
    const { watch, handleSubmit } = useFormContext<LegeerklæringFormInput>();

    const harDokumentasjon = watch(SykdomFormValue.HAR_DOKUMENTASJON);
    const signertAv = watch(SykdomFormValue.SIGNERT_AV);

    return (
        <SøknadsperiodeContext.Consumer>
            {(søknadsperiode) => (
                <Step>
                    <Form
                        onSubmit={handleSubmit(onSubmit)}
                        buttonLabel="Fortsett til vilkårsvurdering"
                        shouldShowSubmitButton={harDokumentasjon === true}
                    >
                        <YesOrNoQuestion
                            question="Finnes det dokumentasjon som er signert av en sykehuslege eller en lege i spesialisthelsetjenesten?"
                            name={SykdomFormValue.HAR_DOKUMENTASJON}
                            validators={{ required }}
                        />
                        {harDokumentasjon === false && (
                            <>
                                <Box marginTop={Margin.large}>
                                    <RadioGroupPanel
                                        question="Hvem har signert legeerklæringen?"
                                        name={SykdomFormValue.SIGNERT_AV}
                                        radios={[
                                            { label: 'Fastlege', value: 'fastlege' },
                                            { label: 'Annen yrkesgruppe', value: 'annenYrkesgruppe' },
                                        ]}
                                        validators={{ required }}
                                    />
                                </Box>
                                {(signertAv === 'fastlege' || signertAv === 'annenYrkesgruppe') && (
                                    <>
                                        <Box marginTop={Margin.large}>
                                            <AlertStripeAdvarsel>
                                                Søknaden må inneholde en legeerklæring signert av en sykehuslege eller
                                                en lege i spesialisthelsetjenesten.
                                                <br />
                                                <br />
                                                <Lenke href="#" className={styles.lenke}>
                                                    {' '}
                                                    Send melding/brev til bruker og be om legeerklæring fra riktig lege.
                                                </Lenke>
                                            </AlertStripeAdvarsel>
                                        </Box>
                                        <Box marginTop={Margin.large}>
                                            <Hovedknapp htmlType="button">Lagre og sett saken på vent</Hovedknapp>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                        {harDokumentasjon === true && (
                            <>
                                <Box marginTop={Margin.large}>
                                    <DiagnosekodeSelektor
                                        name="legeerklæringDiagnose"
                                        initialDiagnosekodeValue=""
                                        // validators={{ required }}
                                        label="Oppgi diagnose(r) som er fastsatt"
                                    />
                                </Box>
                                <Box marginTop={Margin.large}>
                                    <PeriodpickerList
                                        legend="Periode for eventuelle innleggelser"
                                        name={SykdomFormValue.INNLEGGELSESPERIODER}
                                        periodpickerProps={{
                                            fromDatepickerProps: {
                                                name: 'fom',
                                                ariaLabel: 'Innleggelsen gjelder fra',
                                                limitations: {
                                                    minDate: søknadsperiode.fom,
                                                    maxDate: søknadsperiode.tom,
                                                },
                                                validators: {
                                                    datoenInngårISøknadsperioden: (dato) =>
                                                        datoenInngårISøknadsperioden(dato, søknadsperiode),
                                                },
                                            },
                                            toDatepickerProps: {
                                                name: 'tom',
                                                ariaLabel: 'Innleggelsen gjelder til',
                                                limitations: {
                                                    minDate: søknadsperiode.fom,
                                                    maxDate: søknadsperiode.tom,
                                                },
                                                validators: {
                                                    datoenInngårISøknadsperioden: (dato) =>
                                                        datoenInngårISøknadsperioden(dato, søknadsperiode),
                                                },
                                            },
                                        }}
                                    />
                                </Box>
                            </>
                        )}
                    </Form>
                </Step>
            )}
        </SøknadsperiodeContext.Consumer>
    );
};

export default LegeerklæringForm;
