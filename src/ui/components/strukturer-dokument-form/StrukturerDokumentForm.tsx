import { dateConstants, prettifyDateString } from '@navikt/k9-date-utils';
import { Datepicker, RadioGroupPanel } from '@navikt/k9-form-utils';
import { Box, DetailView, Form, Margin } from '@navikt/k9-react-components';
import Lenke from 'nav-frontend-lenker';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import LinkRel from '../../../constants/LinkRel';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import {
    StrukturerDokumentFormFieldName as FieldName,
    StrukturerDokumentFormState,
} from '../../../types/StrukturerDokumentFormState';
import { lagStrukturertDokument } from '../../../util/dokumentUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import { dateIsNotInTheFuture, required } from '../../form/validators';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';

interface StrukturerDokumentFormProps {
    dokument: Dokument;
    onSubmit: (nyttDokument: Dokument) => void;
    editMode?: boolean;
    isSubmitting: boolean;
    alleStrukturerteDokumenter: Dokument[];
}

const StrukturerDokumentForm = ({
    dokument,
    onSubmit,
    editMode,
    isSubmitting,
    alleStrukturerteDokumenter,
}: StrukturerDokumentFormProps): JSX.Element => {
    const { readOnly } = React.useContext(ContainerContext);

    const formMethods = useForm<StrukturerDokumentFormState>({
        defaultValues: editMode && {
            [FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]: dokument.type,
            [FieldName.DATERT]: dokument.datert,
        },
    });

    const { watch } = formMethods;
    const dokumenttype = watch(FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER);
    const dokumentDatert = watch(FieldName.DATERT);

    const potensielleDuplikater = alleStrukturerteDokumenter.filter(
        ({ datert, type }) => datert === dokumentDatert && type === dokumenttype
    );

    const harPotensielleDuplikater = potensielleDuplikater.length > 0;
    const duplikatRadios = () => {
        const radios = potensielleDuplikater.map((potensiellDuplikat) => {
            const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, potensiellDuplikat.links);
            return {
                label: (
                    <Lenke href={dokumentLink.href} target="_blank">
                        {`${potensiellDuplikat.navn} - ${prettifyDateString(potensiellDuplikat.datert)}`}
                    </Lenke>
                ),
                value: potensiellDuplikat.id,
            };
        });
        radios.push({ label: <span>Dokumentet er ikke et duplikat</span>, value: 'ikkeDuplikat' });
        return radios;
    };

    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);

    const lagNyttStrukturertDokument = (formState: StrukturerDokumentFormState) => {
        onSubmit(lagStrukturertDokument(formState, dokument));
    };

    const buttonLabel = editMode === true ? 'Oppdater' : 'Bekreft';

    return (
        <DetailView title="Om dokumentet">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <FormProvider {...formMethods}>
                <Form
                    buttonLabel={buttonLabel}
                    onSubmit={formMethods.handleSubmit(lagNyttStrukturertDokument)}
                    submitButtonDisabled={isSubmitting}
                    shouldShowSubmitButton={!readOnly}
                >
                    <Box marginTop={Margin.xLarge}>
                        <DokumentKnapp href={dokumentLink.href} />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <RadioGroupPanel
                            name={FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER}
                            disabled={readOnly}
                            question="Inneholder dokumentet medisinske opplysninger?"
                            radios={[
                                {
                                    label: 'Ja, legeerklæring fra sykehus/spesialisthelsetjenesten',
                                    value: Dokumenttype.LEGEERKLÆRING,
                                },
                                {
                                    label: 'Ja, andre medisinske opplysninger (f.eks. legeerklæring fra fastlege, uttalelse fra psykolog)',
                                    value: Dokumenttype.ANDRE_MEDISINSKE_OPPLYSNINGER,
                                },
                                {
                                    label: 'Dokumentet inneholder ikke medisinske opplysninger',
                                    value: Dokumenttype.MANGLER_MEDISINSKE_OPPLYSNINGER,
                                },
                            ]}
                            validators={{ required }}
                        />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <Datepicker
                            name={FieldName.DATERT}
                            disabled={readOnly}
                            label="Hvilken dato er dokumentet datert?"
                            defaultValue=""
                            validators={{ required, dateIsNotInTheFuture }}
                            limitations={{ maxDate: dateConstants.today.toISOString() }}
                            inputId="datertField"
                        />
                    </Box>
                    {harPotensielleDuplikater && (
                        <Box marginTop={Margin.xLarge}>
                            <RadioGroupPanel
                                name={FieldName.DUPLIKAT_DOKUMENT}
                                disabled={readOnly}
                                question={
                                    <>
                                        Det finnes et eller flere dokumenter datert til samme dato.
                                        <br />
                                        Velg om dette dokumentet er et duplikat av et av følgende dokumenter:
                                    </>
                                }
                                radios={duplikatRadios()}
                            />
                        </Box>
                    )}
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default StrukturerDokumentForm;
