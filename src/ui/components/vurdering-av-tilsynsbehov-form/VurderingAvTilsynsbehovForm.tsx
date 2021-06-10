import { Period } from '@navikt/k9-period-utils';
import { Box, Form, Margin } from '@navikt/k9-react-components';
import { CheckboxGroup, PeriodpickerList, TextArea, YesOrNoQuestion } from '@navikt/k9-form-utils';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Lenke from 'nav-frontend-lenker';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import {
    finnHullIPerioder,
    finnMaksavgrensningerForPerioder,
    slåSammenSammenhengendePerioder,
} from '../../../util/periodUtils';
import { lagTilsynsbehovVurdering } from '../../../util/vurderingUtils';
import { fomDatoErFørTomDato, harBruktDokumentasjon, required } from '../../form/validators';
import AddButton from '../add-button/AddButton';
import DeleteButton from '../delete-button/DeleteButton';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import styles from './vurderingAvTilsynsbehovForm.less';

export enum FieldName {
    VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE = 'vurderingAvKontinuerligTilsynOgPleie',
    HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE = 'harBehovForKontinuerligTilsynOgPleie',
    PERIODER = 'perioder',
    DOKUMENTER = 'dokumenter',
}

export interface VurderingAvTilsynsbehovFormState {
    [FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE]?: string;
    [FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]?: boolean;
    [FieldName.PERIODER]?: Period[];
    [FieldName.DOKUMENTER]: string[];
}

interface VurderingAvTilsynsbehovFormProps {
    defaultValues: VurderingAvTilsynsbehovFormState;
    onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
    resterendeVurderingsperioder?: Period[];
    perioderSomKanVurderes?: Period[];
    dokumenter: Dokument[];
    onAvbryt: () => void;
    isSubmitting: boolean;
}

const VurderingAvTilsynsbehovForm = ({
    defaultValues,
    onSubmit,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    dokumenter,
    onAvbryt,
    isSubmitting,
}: VurderingAvTilsynsbehovFormProps): JSX.Element => {
    const formMethods = useForm({
        defaultValues,
        mode: 'onChange',
    });

    const perioderSomBlirVurdert = formMethods.watch(FieldName.PERIODER);
    const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
        const dagerSomSkalVurderes = (resterendeVurderingsperioder || []).flatMap((p) => p.asListOfDays());
        const dagerSomBlirVurdert = (perioderSomBlirVurdert || [])
            .map((period) => {
                if ((period as any).period) {
                    return (period as any).period;
                }
                return period;
            })
            .flatMap((p) => p.asListOfDays());
        return dagerSomSkalVurderes.every((dagSomSkalVurderes) => dagerSomBlirVurdert.indexOf(dagSomSkalVurderes) > -1);
    }, [resterendeVurderingsperioder, perioderSomBlirVurdert]);

    const hullISøknadsperiodene = React.useMemo(
        () => finnHullIPerioder(perioderSomKanVurderes).map((period) => period.asInternationalPeriod()),
        [perioderSomKanVurderes]
    );

    const avgrensningerForSøknadsperiode = React.useMemo(
        () => finnMaksavgrensningerForPerioder(perioderSomKanVurderes),
        [perioderSomKanVurderes]
    );

    const lagNyTilsynsvurdering = (formState: VurderingAvTilsynsbehovFormState) => {
        onSubmit(lagTilsynsbehovVurdering(formState, dokumenter));
    };

    const sammenhengendeSøknadsperioder = React.useMemo(() => {
        return slåSammenSammenhengendePerioder(perioderSomKanVurderes);
    }, [perioderSomKanVurderes]);

    return (
        <DetailViewVurdering title="Vurdering av tilsyn og pleie" perioder={defaultValues[FieldName.PERIODER]}>
            <div id="modal" />
            <FormProvider {...formMethods}>
                <Form
                    buttonLabel="Bekreft"
                    onSubmit={formMethods.handleSubmit(lagNyTilsynsvurdering)}
                    onAvbryt={onAvbryt}
                    submitButtonDisabled={isSubmitting}
                    cancelButtonDisabled={isSubmitting}
                >
                    {dokumenter?.length > 0 && (
                        <Box marginTop={Margin.large}>
                            <CheckboxGroup
                                question="Hvilke dokumenter er brukt i vurderingen av tilsyn og pleie?"
                                name={FieldName.DOKUMENTER}
                                checkboxes={dokumenter.map((dokument) => ({
                                    value: dokument.id,
                                    label: (
                                        <DokumentLink
                                            dokument={dokument}
                                            etikett={dokument.annenPartErKilde ? 'Dokument fra annen part' : ''}
                                        />
                                    ),
                                }))}
                                validators={{
                                    harBruktDokumentasjon,
                                }}
                            />
                        </Box>
                    )}
                    <Box marginTop={Margin.xLarge}>
                        <TextArea
                            id="begrunnelsesfelt"
                            textareaClass={styles.begrunnelsesfelt}
                            name={FieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE}
                            label={
                                <>
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    <b>
                                        Gjør en vurdering av om det er behov for kontinuerlig tilsyn og pleie som følge
                                        av sykdommen etter § 9-10, første ledd.
                                    </b>
                                    <p className={styles.begrunnelsesfelt__labeltekst}>
                                        Du skal ta utgangspunkt i{' '}
                                        <Lenke href="https://lovdata.no/nav/folketrygdloven/kap9" target="_blank">
                                            lovteksten
                                        </Lenke>{' '}
                                        og{' '}
                                        <Lenke
                                            href="https://lovdata.no/nav/rundskriv/r09-00#ref/lov/1997-02-28-19/%C2%A79-10"
                                            target="_blank"
                                        >
                                            rundskrivet
                                        </Lenke>{' '}
                                        når du skriver vurderingen.
                                    </p>

                                    <p className={styles.begrunnelsesfelt__labeltekst}>Vurderingen skal beskrive:</p>
                                    <ul className={styles.begrunnelsesfelt__liste}>
                                        <li>Om det er årsakssammenheng mellom sykdom og pleiebehov</li>
                                        <li>Om behovet er kontinuerlig og ikke situasjonsbestemt</li>
                                    </ul>
                                </>
                            }
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <YesOrNoQuestion
                            question="Er det behov for tilsyn og pleie?"
                            name={FieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE}
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <PeriodpickerList
                            legend="Oppgi perioder"
                            name={FieldName.PERIODER}
                            defaultValues={defaultValues[FieldName.PERIODER] || []}
                            validators={{
                                required,
                                inngårISammenhengendeSøknadsperiode: (value: Period) => {
                                    const isOk = sammenhengendeSøknadsperioder.some((sammenhengendeSøknadsperiode) =>
                                        sammenhengendeSøknadsperiode.covers(value)
                                    );

                                    if (!isOk) {
                                        return 'Perioden som vurderes må være innenfor en eller flere sammenhengede søknadsperioder';
                                    }

                                    return true;
                                },
                                fomDatoErFørTomDato,
                            }}
                            fromDatepickerProps={{
                                label: 'Fra',
                                ariaLabel: 'fra',
                                limitations: {
                                    minDate: avgrensningerForSøknadsperiode?.fom,
                                    maxDate: avgrensningerForSøknadsperiode?.tom,
                                    invalidDateRanges: hullISøknadsperiodene,
                                },
                            }}
                            toDatepickerProps={{
                                label: 'Til',
                                ariaLabel: 'til',
                                limitations: {
                                    minDate: avgrensningerForSøknadsperiode?.fom,
                                    maxDate: avgrensningerForSøknadsperiode?.tom,
                                    invalidDateRanges: hullISøknadsperiodene,
                                },
                            }}
                            renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => {
                                return (
                                    <>
                                        {numberOfItems > 1 && (
                                            <DeleteButton
                                                onClick={() => {
                                                    fieldArrayMethods.remove(index);
                                                }}
                                            />
                                        )}
                                    </>
                                );
                            }}
                            renderAfterFieldArray={(fieldArrayMethods) => (
                                <Box marginTop={Margin.large}>
                                    <AddButton
                                        label="Legg til periode"
                                        onClick={() => fieldArrayMethods.append({ fom: '', tom: '' })}
                                        id="leggTilPeriodeKnapp"
                                    />
                                </Box>
                            )}
                        />
                    </Box>
                    {!harVurdertAlleDagerSomSkalVurderes && (
                        <Box marginTop={Margin.xLarge}>
                            <AlertStripeInfo>
                                Du har ikke vurdert alle periodene som må vurderes. Resterende perioder vurderer du
                                etter at du har lagret denne.
                            </AlertStripeInfo>
                        </Box>
                    )}
                </Form>
            </FormProvider>
        </DetailViewVurdering>
    );
};

export default VurderingAvTilsynsbehovForm;
