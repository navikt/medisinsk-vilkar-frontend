import dayjs from 'dayjs';

import {
    CheckboxGroup,
    Datepicker,
    RadioGroupPanel,
    TextArea
} from '@navikt/k9-form-utils';
import { Period } from '@navikt/k9-period-utils';
import { Box, ContentWithTooltip, Form, Margin, OnePersonOutlineGray } from '@navikt/k9-react-components';
import Ikon from 'nav-frontend-ikoner-assets';
import Lenke from 'nav-frontend-lenker';
import { Element } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Dokument from '../../../types/Dokument';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { lagSluttfaseVurdering, lagSplittetSluttfaseVurdering } from '../../../util/vurderingUtils';
import ContainerContext from '../../context/ContainerContext';
import { harBruktDokumentasjon, required } from '../../form/validators';
import DetailViewVurdering from '../detail-view-vurdering/DetailViewVurdering';
import DokumentLink from '../dokument-link/DokumentLink';
import VurderingDokumentfilter from '../vurdering-dokumentfilter/VurderingDokumentfilter';
import vurderingDokumentfilterOptions from '../vurdering-dokumentfilter/vurderingDokumentfilterOptions';
import StjerneIkon from './StjerneIkon';
import styles from './VurderingAvLivetsSluttfaseForm.less';
import Vurderingsresultat from '../../../types/Vurderingsresultat';

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
    onSubmit: (nyVurdering: Partial<Vurderingsversjon>) => void;
    dokumenter: Dokument[];
    onAvbryt: () => void;
    isSubmitting: boolean;
    sluttfasePeriode?: { fom: string; tom: string };
    erNyVurdering?: boolean;
}

const VurderingAvLivetsSluttfaseForm = ({
    defaultValues,
    onSubmit,
    dokumenter,
    onAvbryt,
    isSubmitting,
    sluttfasePeriode,
    erNyVurdering = false,
}: VurderingAvLivetsSluttfaseFormProps): JSX.Element => {
    const { readOnly } = React.useContext(ContainerContext);
    const formMethods = useForm({
        defaultValues,
        mode: 'onChange',

    });
    const [visAlleDokumenter, setVisAlleDokumenter] = useState(false);
    const [dokumentFilter, setDokumentFilter] = useState([]);
    const [visSplittetPeriode, setVisSplittetPeriode] = useState<boolean>(false);

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
        const vurderinger = [];
        if (formState[FieldName.ER_I_LIVETS_SLUTTFASE] === Vurderingsresultat.DELVIS_OPPFYLT) {
            vurderinger.push(...lagSplittetSluttfaseVurdering({ ...formState, perioder: defaultValues.perioder }, dokumenter));
        } else {
            vurderinger.push(lagSluttfaseVurdering({ ...formState, perioder: defaultValues.perioder }, dokumenter));
        }

        if (erNyVurdering) vurderinger.map(vurdering => onSubmit(vurdering));
        else onSubmit(vurderinger.pop());
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
                                { value: Vurderingsresultat.DELVIS_OPPFYLT, label: 'Delvis' },
                            ]}
                            validators={{ required }}
                            disabled={readOnly}
                            onChange={(value) => setVisSplittetPeriode(value === Vurderingsresultat.DELVIS_OPPFYLT)}
                        />
                    </Box>

                    {visSplittetPeriode && (
                        /**
                         * Dato for endret startdato på livets sluttfase skal bare vises om man velger
                         * delvis i vurderingen over. 
                         */
                        <>
                            <Box marginTop={Margin.xLarge}>
                                <Datepicker
                                    inputId="splitt-periode-dato"
                                    name={FieldName.SPLITT_PERIODE_DATO}
                                    disabled={readOnly}
                                    label="Startdato for livets sluttfase"
                                    defaultValue={sluttfasePeriode.fom}
                                    validators={{ required }}
                                    limitations={{
                                        minDate: dayjs(sluttfasePeriode.fom).toISOString(),
                                        maxDate: dayjs(sluttfasePeriode.tom).toISOString()
                                    }}
                                />
                            </Box>
                        </>
                    )}
                </Form>
            </FormProvider>
        </DetailViewVurdering>
    );
};

export default VurderingAvLivetsSluttfaseForm;
