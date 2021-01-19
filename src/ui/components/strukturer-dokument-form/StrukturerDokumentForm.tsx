import React from 'react';
import Lenke from 'nav-frontend-lenker';
import { FormProvider, useForm } from 'react-hook-form';
import DetailView from '../detail-view/DetailView';
import RadioGroupPanel from '../../form/wrappers/RadioGroupPanel';
import Form from '../form/Form';
import Datepicker from '../../form/wrappers/Datepicker';
import Box, { Margin } from '../box/Box';
import YesOrNoQuestion from '../../form/wrappers/YesOrNoQuestion';
import PeriodWrapper from '../../form/types/PeriodWrapper';
import { required } from '../../form/validators';
import { Dokument, Dokumenttype } from '../../../types/Dokument';
import { lagStrukturertDokument } from '../../../util/dokumentUtils';
import { prettifyDate } from '../../../util/formats';

export enum FieldName {
    INNEHOLDER_MEDISINSKE_OPPLYSNINGER = 'inneholderMedisinskeOpplysninger',
    DATERT = 'datert',
    SIGNERT_AV_SYKEHUSLEGE_ELLER_LEGE_I_SPESIALISTHELSETJENESTEN = 'signertAvSykehuslegeEllerLegeISpesialisthelsetjenesten',
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}

export interface StrukturerDokumentFormState {
    [FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER]?: Dokumenttype;
    [FieldName.DATERT]: string;
    [FieldName.SIGNERT_AV_SYKEHUSLEGE_ELLER_LEGE_I_SPESIALISTHELSETJENESTEN]?: boolean;
}

interface StrukturerDokumentFormProps {
    dokument: Dokument;
    onSubmit: (nyttDokument: Dokument) => void;
}

const StrukturerDokumentForm = ({ dokument, onSubmit }: StrukturerDokumentFormProps) => {
    const formMethods = useForm<StrukturerDokumentFormState>();

    const lagNyttStrukturertDokument = (formState: StrukturerDokumentFormState) => {
        onSubmit(lagStrukturertDokument(formState, dokument));
    };

    return (
        <DetailView title="Om dokumentet">
            <FormProvider {...formMethods}>
                <Form
                    buttonLabel="Bekreft"
                    onSubmit={formMethods.handleSubmit((formState) => lagNyttStrukturertDokument(formState))}
                >
                    <Box marginTop={Margin.xLarge}>
                        <Lenke href={dokument.location} target="_blank">
                            Åpne dokument
                        </Lenke>
                    </Box>
                    <Box marginTop={Margin.xLarge}>
                        <RadioGroupPanel
                            name={FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER}
                            question="Inneholder dokumentet medisinske opplysninger?"
                            radios={[
                                {
                                    label: 'Ja, legeerklæring',
                                    value: Dokumenttype.LEGEERKLÆRING,
                                },
                                {
                                    label: 'Ja, andre medisinske opplysninger (f.eks. ...)',
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
                            validators={{ required }}
                        />
                    </Box>
                </Form>
            </FormProvider>
        </DetailView>
    );
};

export default StrukturerDokumentForm;
