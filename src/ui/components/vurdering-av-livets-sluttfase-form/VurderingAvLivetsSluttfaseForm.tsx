import {
    CheckboxGroup,
    PeriodpickerList,
    RadioGroupPanel,
    TextArea
} from '@navikt/k9-form-utils';
import { Period } from '@navikt/k9-period-utils';
import { Box, ContentWithTooltip, Form, Margin, OnePersonOutlineGray } from '@navikt/k9-react-components';
import Ikon from 'nav-frontend-ikoner-assets';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { lagSluttfaseVurdering } from '../../../util/vurderingUtils';
import ContainerContext from '../../context/ContainerContext';
import { fomDatoErFørTomDato, harBruktDokumentasjon, required } from '../../form/validators';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import VurderingDokumentfilter from '../vurdering-dokumentfilter/VurderingDokumentfilter';
import vurderingDokumentfilterOptions from '../vurdering-dokumentfilter/vurderingDokumentfilterOptions';
import StjerneIkon from './StjerneIkon';
import styles from './VurderingAvLivetsSluttfaseForm.less';
import Vurderingsresultat from '../../../types/Vurderingsresultat';
import DeleteButton from '../delete-button/DeleteButton';
import AddButton from '../add-button/AddButton';
import { finnHullIPerioder, finnMaksavgrensningerForPerioder, slåSammenSammenhengendePerioder } from '../../../util/periodUtils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export enum FieldName {
    VURDERING_AV_LIVETS_SLUTTFASE = 'vurderingAvLivetsSluttfase',
    ER_I_LIVETS_SLUTTFASE = 'erILivetsSluttfase',
    SPLITT_PERIODE_DATO = "splittPeriodeDato",
    DOKUMENTER = 'dokumenter',
    PERIODER = 'perioder',
}

export interface VurderingAvLivetsSluttfaseFormState {
    [FieldName.VURDERING_AV_LIVETS_SLUTTFASE]?: string;
    [FieldName.ER_I_LIVETS_SLUTTFASE]?: Vurderingsresultat;
    [FieldName.SPLITT_PERIODE_DATO]?: string;
    [FieldName.DOKUMENTER]: string[];
    [FieldName.PERIODER]?: Period[];
}

interface VurderingAvLivetsSluttfaseFormProps {
    defaultValues: VurderingAvLivetsSluttfaseFormState;
    resterendeVurderingsperioder?: Period[];
    perioderSomKanVurderes?: Period[];
    onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
    dokumenter: Dokument[];
    onAvbryt: () => void;
    isSubmitting: boolean;
}

const VurderingAvLivetsSluttfaseForm = ({
    defaultValues,
    resterendeVurderingsperioder,
    perioderSomKanVurderes,
    onSubmit,
    dokumenter,
    onAvbryt,
    isSubmitting,
}: VurderingAvLivetsSluttfaseFormProps): JSX.Element => {
    const { readOnly } = React.useContext(ContainerContext);
    const formMethods = useForm({
        defaultValues,
        mode: 'onChange',
    });
    const [visAlleDokumenter, setVisAlleDokumenter] = useState(false);
    const [dokumentFilter, setDokumentFilter] = useState([]);

    const sammenhengendeSøknadsperioder = slåSammenSammenhengendePerioder(perioderSomKanVurderes);

    const avgrensningerForSøknadsperiode = React.useMemo(
        () => finnMaksavgrensningerForPerioder(perioderSomKanVurderes),
        [perioderSomKanVurderes]
    );

    const hullISøknadsperiodene = React.useMemo(
        () => finnHullIPerioder(perioderSomKanVurderes).map((period) => period.asInternationalPeriod()),
        [perioderSomKanVurderes]
    );

    const updateDokumentFilter = (valgtFilter) => {
        if (dokumentFilter.includes(valgtFilter)) {
            if (dokumentFilter.length === 1) {
                setVisAlleDokumenter(false);
            }
            setDokumentFilter(dokumentFilter.filter((v) => v !== valgtFilter));
        } else {
            setDokumentFilter(dokumentFilter.concat([valgtFilter]));
            setVisAlleDokumenter(true);
        }
    };

    const perioderSomBlirVurdert: any[] = useWatch({ control: formMethods.control, name: FieldName.PERIODER });

    const harVurdertAlleDagerSomSkalVurderes = React.useMemo(() => {
        const dagerSomSkalVurderes = (resterendeVurderingsperioder || []).flatMap((p) => p.asListOfDays());
        const dagerSomBlirVurdert = (perioderSomBlirVurdert || [])
            .map((period) => {
                if ((period as AnyType).period) {
                    return (period as AnyType).period;
                }
                return period;
            })
            .flatMap((p) => p.asListOfDays());
        return dagerSomSkalVurderes.every((dagSomSkalVurderes) => dagerSomBlirVurdert.indexOf(dagSomSkalVurderes) > -1);
    }, [resterendeVurderingsperioder, perioderSomBlirVurdert]);

    const getDokumenterSomSkalVises = () => {
        const filtrerteDokumenter = dokumenter.filter((dokument) => {
            if (!dokumentFilter.length) {
                return true;
            }
            return dokumentFilter.some((filter) => dokument[filter] === true);
        });

        return filtrerteDokumenter.filter((dokument, index) => {
            if (dokumentFilter.length === 0) {
                if (dokumenter.length < 6) {
                    return true;
                }
                if (!visAlleDokumenter && index > 4) {
                    return false;
                }
            }
            return true;
        });
    };

    const visFlereDokumenterKnapp = () => {
        if (dokumentFilter.length > 0) {
            return false;
        }
        if (dokumenter.length < 6) {
            return false;
        }
        return true;
    };

    const lagNySluttfaseVurdering = (formState: VurderingAvLivetsSluttfaseFormState) => {
        onSubmit(lagSluttfaseVurdering(formState, dokumenter));
    };

    return (
        <DetailViewVurdering title="Vurdering av livets sluttfase" perioder={defaultValues.perioder}>
            <div id="modal" />
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <FormProvider {...formMethods}>
                <Form
                    buttonLabel="Bekreft"
                    onSubmit={formMethods.handleSubmit(lagNySluttfaseVurdering)}
                    onAvbryt={onAvbryt}
                    submitButtonDisabled={isSubmitting}
                    cancelButtonDisabled={isSubmitting}
                    shouldShowSubmitButton={!readOnly}
                >
                    {dokumenter?.length > 0 && (
                        <Box marginTop={Margin.large}>
                            <Element aria-hidden="true">
                                Hvilke dokumenter er brukt i vurderingen av livets sluttfase?
                            </Element>
                            <div className={styles.filterContainer}>
                                <VurderingDokumentfilter
                                    text="Filter"
                                    filters={dokumentFilter}
                                    onFilterChange={updateDokumentFilter}
                                />
                            </div>
                            {dokumentFilter.length > 0 && (
                                <div className={styles.filterKnappContainer}>
                                    {dokumentFilter.map((filter) => {
                                        const { label } = vurderingDokumentfilterOptions.find(
                                            (option) => option.attributtNavn === filter
                                        );
                                        return (
                                            <button
                                                onClick={() => updateDokumentFilter(filter)}
                                                className={styles.fjernFilterKnapp}
                                                type="button"
                                            >
                                                {label}
                                                <Ikon kind="x" />
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                            <div className={styles.checkboxGroupWrapper}>
                                <CheckboxGroup
                                    question="Hvilke dokumenter er brukt i vurderingen av livets sluttfase?"
                                    name={FieldName.DOKUMENTER}
                                    checkboxes={getDokumenterSomSkalVises().map((dokument) => ({
                                        value: dokument.id,
                                        label: (
                                            <DokumentLink
                                                dokument={dokument}
                                                etikett={
                                                    <div className={styles.dokumentEtiketter}>
                                                        {dokument.annenPartErKilde && (
                                                            <ContentWithTooltip
                                                                tooltipText="Dokument fra annen part"
                                                                tooltipDirectionRight
                                                            >
                                                                <OnePersonOutlineGray />
                                                            </ContentWithTooltip>
                                                        )}
                                                        {dokument.bruktTilMinstEnVurdering && (
                                                            <ContentWithTooltip
                                                                tooltipText="Dokumentet er brukt i en annen vurdering"
                                                                tooltipDirectionRight
                                                            >
                                                                <StjerneIkon />
                                                            </ContentWithTooltip>
                                                        )}
                                                    </div>
                                                }
                                            />
                                        ),
                                    }))}
                                    validators={{
                                        harBruktDokumentasjon,
                                    }}
                                    disabled={readOnly}
                                />
                            </div>
                            {visFlereDokumenterKnapp() && (
                                <button
                                    className={styles.visDokumenterKnapp}
                                    onClick={() => setVisAlleDokumenter(!visAlleDokumenter)}
                                    type="button"
                                >
                                    {visAlleDokumenter
                                        ? `Vis færre dokumenter`
                                        : `Vis alle dokumenter (${dokumenter.length})`}
                                </button>
                            )}
                        </Box>
                    )}
                    <Box marginTop={Margin.xLarge}>
                        <TextArea
                            id="begrunnelsesfelt"
                            disabled={readOnly}
                            textareaClass={styles.begrunnelsesfelt}
                            name={FieldName.VURDERING_AV_LIVETS_SLUTTFASE}
                            label={
                                <>
                                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                                    <b>
                                        Legg inn tekst rundt paragrafen som ommfatter livets sluttfase, og oppdater
                                        lenkene nedenfor til riktig referanse i folketrygdeloven
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
                        <RadioGroupPanel
                            question="Hva er vurderingen av livets sluttfase?"
                            name={FieldName.ER_I_LIVETS_SLUTTFASE}
                            radios={[
                                { value: Vurderingsresultat.OPPFYLT, label: 'Ja' },
                                { value: Vurderingsresultat.IKKE_OPPFYLT, label: 'Nei' },
                            ]}
                            validators={{ required }}
                            disabled={readOnly}
                        />
                    </Box>

                    <Box marginTop={Margin.xLarge}>
                        <PeriodpickerList
                            legend="Oppgi perioder"
                            name={FieldName.PERIODER}
                            disabled={readOnly}
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
                            renderContentAfterElement={(index, numberOfItems, fieldArrayMethods) => (
                                <>
                                    {numberOfItems > 1 && (
                                        <DeleteButton
                                            onClick={() => {
                                                fieldArrayMethods.remove(index);
                                            }}
                                        />
                                    )}
                                </>
                            )}
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

export default VurderingAvLivetsSluttfaseForm;
