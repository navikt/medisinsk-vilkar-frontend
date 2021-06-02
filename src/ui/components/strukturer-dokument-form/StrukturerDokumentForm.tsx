import { Form, DetailView, Box, Margin } from '@navikt/k9-react-components';
import { dateConstants } from '@navikt/k9-date-utils';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import Datepicker from '../../form/wrappers/Datepicker';
import { dateIsNotInTheFuture, required } from '../../form/validators';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import { lagStrukturertDokument } from '../../../util/dokumentUtils';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import DokumentKnapp from '../dokument-knapp/DokumentKnapp';
import {
    StrukturerDokumentFormState,
    StrukturerDokumentFormFieldName as FieldName,
} from '../../../types/StrukturerDokumentFormState';

interface StrukturerDokumentFormProps {
    dokument: Dokument;
    onSubmit: (nyttDokument: Dokument) => void;
    editMode?: boolean;
    isSubmitting: boolean;
}

const StrukturerDokumentForm = ({ dokument, onSubmit, editMode, isSubmitting }: StrukturerDokumentFormProps) => {
    const formMethods = useForm<StrukturerDokumentFormState>({
        defaultValues: editMode && {
            [FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]: dokument.type,
            [FieldName.DATERT]: dokument.datert,
        },
    });
    const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, dokument.links);

    const lagNyttStrukturertDokument = (formState: StrukturerDokumentFormState) => {
        onSubmit(lagStrukturertDokument(formState, dokument));
    };

    const buttonLabel = editMode === true ? 'Oppdater' : 'Bekreft';

    return (
        <DetailView title="Om dokumentet">
            <FormProvider {...formMethods}>
                <Form
                    buttonLabel={buttonLabel}
                    onSubmit={formMethods.handleSubmit(lagNyttStrukturertDokument)}
                    submitButtonDisabled={isSubmitting}
                >
                    <Box marginTop={Margin.xLarge}>
                        <DokumentKnapp href={dokumentLink.href} />
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <RadioGroupPanel
                            name={FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER}
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
                            label="Hvilken dato er dokumentet datert?"
                            defaultValue=""
                            validators={{ required, dateIsNotInTheFuture }}
                            limitations={{ maxDate: dateConstants.today.toISOString() }}
                            inputId="datertField"
                        />
                    </Box>
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default StrukturerDokumentForm;
