import dayjs from 'dayjs';

import { Period } from '@navikt/k9-period-utils';
import {
    FieldName as TilsynFieldName,
    VurderingAvTilsynsbehovFormState,
} from '../ui/components/vurdering-av-tilsynsbehov-form/VurderingAvTilsynsbehovForm';
import {
    FieldName as ToOmsorgspersonerFieldName,
    VurderingAvToOmsorgspersonerFormState,
} from '../ui/components/vurdering-av-to-omsorgspersoner-form/VurderingAvToOmsorgspersonerForm';
import {
    FieldName as LivetsSluttfaseFieldName,
    VurderingAvLivetsSluttfaseFormState,
} from '../ui/components/vurdering-av-livets-sluttfase-form/VurderingAvLivetsSluttfaseForm';
import Vurderingsresultat from '../types/Vurderingsresultat';
import Dokument from '../types/Dokument';
import { Vurderingsversjon } from '../types/Vurdering';
import { finnBenyttedeDokumenter } from './dokumentUtils';
import { finnMaksavgrensningerForPerioder } from './periodUtils';
import Vurderingselement from '../types/Vurderingselement';
import isBetween from 'dayjs/plugin/isBetween';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any;

export const lagTilsynsbehovVurdering = (
    formState: VurderingAvTilsynsbehovFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = formState[TilsynFieldName.HAR_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE]
        ? Vurderingsresultat.OPPFYLT
        : Vurderingsresultat.IKKE_OPPFYLT;

    const perioder = formState[TilsynFieldName.PERIODER].map(
        (periodeWrapper) => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom)
    );
    const begrunnelse = formState[TilsynFieldName.VURDERING_AV_KONTINUERLIG_TILSYN_OG_PLEIE];

    return {
        resultat,
        perioder,
        tekst: begrunnelse,
        dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
    };
};

export const lagToOmsorgspersonerVurdering = (
    formState: VurderingAvToOmsorgspersonerFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = formState[ToOmsorgspersonerFieldName.HAR_BEHOV_FOR_TO_OMSORGSPERSONER]
        ? Vurderingsresultat.OPPFYLT
        : Vurderingsresultat.IKKE_OPPFYLT;
    const perioder = formState[TilsynFieldName.PERIODER].map(
        (periodeWrapper) => new Period((periodeWrapper as AnyType).period.fom, (periodeWrapper as AnyType).period.tom)
    );
    const begrunnelse = formState[ToOmsorgspersonerFieldName.VURDERING_AV_TO_OMSORGSPERSONER];

    return {
        resultat,
        perioder,
        tekst: begrunnelse,
        dokumenter: finnBenyttedeDokumenter(formState[TilsynFieldName.DOKUMENTER], alleDokumenter),
    };
};

export const lagSluttfaseVurdering = (
    formState: VurderingAvLivetsSluttfaseFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon> => {
    const resultat = Vurderingsresultat[formState[LivetsSluttfaseFieldName.ER_I_LIVETS_SLUTTFASE]];
    const begrunnelse = formState[LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE];

    // Vurdering av livets sluttfase skal sende inn samme periode som ble hentet fra backend
    const perioder = formState[LivetsSluttfaseFieldName.PERIODER].map(
        (periodeWrapper) => new Period(periodeWrapper.fom, periodeWrapper.tom)
    );

    return {
        resultat,
        tekst: begrunnelse,
        perioder,
        dokumenter: finnBenyttedeDokumenter(formState[LivetsSluttfaseFieldName.DOKUMENTER], alleDokumenter),
    };
};

export const lagSplittetSluttfaseVurdering = (
    formState: VurderingAvLivetsSluttfaseFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon>[] => {
    const maksavgrensning = finnMaksavgrensningerForPerioder(formState[LivetsSluttfaseFieldName.PERIODER]);
    const dokumenter = finnBenyttedeDokumenter(formState[LivetsSluttfaseFieldName.DOKUMENTER], alleDokumenter);

    return [
        /**
         * Første periode, fom første mulige dato, frem til dagen før "splittdatoen"
         */
        {
            resultat: Vurderingsresultat.IKKE_OPPFYLT,
            tekst: formState[LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE],
            perioder: [
                new Period(
                    maksavgrensning.fom,
                    dayjs(formState[LivetsSluttfaseFieldName.SPLITT_PERIODE_DATO]).subtract(1, 'day').format('YYYY-MM-DD')
                ),
            ],
            dokumenter,
        },
        /**
         * Andre periode fom splittdatoen og tom siste dag i søknadsperioden
         */
        {
            resultat: Vurderingsresultat.OPPFYLT,
            tekst: formState[LivetsSluttfaseFieldName.VURDERING_AV_LIVETS_SLUTTFASE],
            perioder: [
                new Period(
                    formState[LivetsSluttfaseFieldName.SPLITT_PERIODE_DATO],
                    maksavgrensning.tom
                ),
            ],
            dokumenter,
        }
    ];
}

export const lagNySluttfaseRevurdering = (
    formState: VurderingAvLivetsSluttfaseFormState,
    alleDokumenter: Dokument[]
): Partial<Vurderingsversjon>[] => {
    const dokumenter = finnBenyttedeDokumenter(formState[LivetsSluttfaseFieldName.DOKUMENTER], alleDokumenter);



    // return [];
    return [
        // {
        //     "resultat": Vurderingsresultat.IKKE_OPPFYLT,
        //     "tekst": "asdf",
        //     "perioder": [
        //         new Period("2022-02-08", "2022-02-10")
        //     ],
        //     dokumenter
        // },
        // {
        //     "resultat": Vurderingsresultat.IKKE_OPPFYLT,
        //     "tekst": "asdf",
        //     "perioder": [
        //         new Period("2022-02-15", "2022-02-20")
        //     ],
        //     dokumenter
        // },
        {
            "resultat": Vurderingsresultat.IKKE_OPPFYLT,
            "tekst": "asdf",
            "perioder": [
                new Period("2022-02-10", "2022-02-17")
            ],
            dokumenter
        },
        // {
        //     "resultat": Vurderingsresultat.IKKE_OPPFYLT,
        //     "tekst": "asdf",
        //     "perioder": [
        //         new Period("2020-01-01", "2022-02-07")
        //     ],
        //     dokumenter
        // },
        // {
        //     "resultat": Vurderingsresultat.IKKE_OPPFYLT,
        //     "tekst": "asdf",
        //     "perioder": [
        //         new Period("2022-02-08", "2022-11-02")
        //     ],
        //     dokumenter
        // },
        // {
        //     "resultat": Vurderingsresultat.OPPFYLT,
        //     "tekst": "asdf",
        //     "perioder": [
        //         new Period("2022-02-12", "2022-02-22")
        //     ],
        //     dokumenter
        // },
        // {
        //     "resultat": Vurderingsresultat.OPPFYLT,
        //     "tekst": "asdf",
        //     "perioder": [
        //         new Period("2022-02-23", "2099-12-31")
        //     ],
        //     dokumenter
        // }
    ];
};

// export const lagNySluttfaseRevurdering = (
//     formState: VurderingAvLivetsSluttfaseFormState,
//     alleDokumenter: Dokument[],
//     vurderingselementer: Vurderingselement[]
// ): Partial<Vurderingsversjon>[] => {
//     dayjs.extend(isBetween)
//     console.log("vi skal lage ny sluttfasevurdering");
//     console.log("formstate", formState);
//     // console.log("alldokumenter", alleDokumenter);
//     // console.log("vurderingselementer", vurderingselementer);

//     const splittDato = dayjs(formState[LivetsSluttfaseFieldName.SPLITT_PERIODE_DATO]);
//     const dokumenter = finnBenyttedeDokumenter(formState[LivetsSluttfaseFieldName.DOKUMENTER], alleDokumenter);

//     vurderingselementer.forEach((vurderingselement) => {
//         console.log(" ", "=========================");
//         let resultat = Vurderingsresultat.IKKE_OPPFYLT;
//         const fomDato = dayjs(vurderingselement.periode.fom);
//         const tomDato = dayjs(vurderingselement.periode.tom);
//         console.log("splittdato", formState[LivetsSluttfaseFieldName.SPLITT_PERIODE_DATO]);
//         console.log("fomDato", vurderingselement.periode.fom);
//         console.log("tomDato", vurderingselement.periode.tom);

//         if (splittDato.isBefore(fomDato, 'day')) {
//             console.log("splittDato er før fomDato");
//             resultat = Vurderingsresultat.OPPFYLT;
//         } else if (splittDato.isSame(fomDato, 'day')) {
//             console.log("splittDato er lik fomDato");
//             resultat = Vurderingsresultat.OPPFYLT;
//         } else if (splittDato.isAfter(tomDato, 'day')) {
//             console.log("splittDato er etter tomDato");
//             resultat = Vurderingsresultat.IKKE_OPPFYLT;
//         } else if (splittDato.isBetween(fomDato, tomDato, 'day', '()')) {
//             console.log("splittDato er mellom fomDato og tomDato");
//             resultat = Vurderingsresultat.DELVIS_OPPFYLT;
//         }

//         if (splittDato.isBetween(fomDato, tomDato, 'day', '[]')) {
//             console.log("splittDato er mellom fomDato og tomDato");
//         } else {
//             console.log("denne perioden er utenom splittdatoen");
//         }


//         // console.log("vurderingselement", vurderingselement);
//     });

//     return [];
// };

