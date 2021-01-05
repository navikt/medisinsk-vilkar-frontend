import Dokument, { StrukturertDokument } from '../types/Dokument';
import {
    FieldName,
    InneholderMedisinskeOpplysningerValue,
    StrukturerDokumentFormState,
} from '../ui/components/strukturer-dokument-form/StrukturerDokumentForm';

export const finnBenyttedeDokumenter = (benyttedeDokumentIder: string[], alleDokumenter: Dokument[]): Dokument[] => {
    return alleDokumenter.filter((dokument) => {
        return benyttedeDokumentIder.includes(dokument.id);
    });
};

export const lagStrukturertDokument = (formState: StrukturerDokumentFormState): StrukturertDokument => {
    const harMedisinskeOpplysninger =
        formState[FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER] ===
            InneholderMedisinskeOpplysningerValue.LEGEERKLÆRING ||
        formState[FieldName.INNEHOLDER_MEDISINSKE_OPPLYSNINGER] === InneholderMedisinskeOpplysningerValue.ANNET;

    return {
        type: harMedisinskeOpplysninger ? DokumentMedMedisinske,
        datert: formState[FieldName.DATERT],
        harGyldigSignatur: formState[FieldName.SIGNERT_AV_SYKEHUSLEGE_ELLER_LEGE_I_SPESIALISTHELSETJENESTEN] === true,
        innleggelsesperioder: formState[FieldName.INNLEGGELSESPERIODER],
    };
};

/*

export const lagTilsynsbehovVurdering = (
    formState: VurderingAvTilsynsbehovFormState,
    alleDokumenter: Dokument[]
): TilsynsbehovVurdering => {
    const resultat = formState[TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
        ? Vurderingsresultat.INNVILGET
        : Vurderingsresultat.AVSLÅTT;
    const perioder = formState[TilsynFieldName.PERIODER].map((periodeWrapper) => {
        return new Period((periodeWrapper as any).period.fom, (periodeWrapper as any).period.tom);
    });
    const begrunnelse = formState[TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

    return {
        id: 'someID',
        resultat,
        perioder,
        begrunnelse,
        dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
    };
};


*/
