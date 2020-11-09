import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Systemtittel } from 'nav-frontend-typografi';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import VurderingAvToOmsorgspersonerForm from '../form-vurdering-to-omsorgspersoner/VurderingAvToOmsorgspersonerForm';
import VurderingAvTilsynsbehovForm from '../form-vurdering-av-tilsynsbehov/VurderingAvTilsynsbehovForm';
import { getPeriodDifference } from '../../../util/dateUtils';
import Step from '../step/Step';
import SykdomFormState, { SykdomFormValue } from '../../../types/SykdomFormState';
import Tilsynsbehov from '../../../types/Tilsynsbehov';
import { erHeltEllerDelvisOppfylt } from '../../../util/domain';
import { Period } from '../../../types/Period';
import PeriodeMedGradAvTilsynsbehov from '../../../types/PeriodeMedGradAvTilsynsbehov';
import GradAvTilsynsbehov from '../../../types/GradAvTilsynsbehov';
import {
    lagPeriodeMedBehovForEnTilsynsperson,
    lagPeriodeMedBehovForToTilsynspersoner,
    lagPeriodeMedIngenTilsynsbehov,
    lagPeriodeMedInnleggelse,
} from '../../../util/periodeMedTilsynsbehov';

interface VilkårsvurderingFormProps {
    sykdom: Sykdom;
    onSubmit: (d) => void;
}

const settGradAvTilsynsbehov = (perioder: Period[], gradAvTilsynsbehov: GradAvTilsynsbehov) => {
    if (gradAvTilsynsbehov === GradAvTilsynsbehov.BEHOV_FOR_EN) {
        return perioder.map(lagPeriodeMedBehovForEnTilsynsperson);
    }
    if (gradAvTilsynsbehov === GradAvTilsynsbehov.BEHOV_FOR_TO) {
        return perioder.map(lagPeriodeMedBehovForToTilsynspersoner);
    }
    if (gradAvTilsynsbehov === GradAvTilsynsbehov.INNLAGT) {
        return perioder.map(lagPeriodeMedInnleggelse);
    }
    if (gradAvTilsynsbehov === GradAvTilsynsbehov.IKKE_BEHOV) {
        return perioder.map(lagPeriodeMedIngenTilsynsbehov);
    }
};

const finnPerioderMedBehovForEnPerson = (
    tilsynsbehov: Tilsynsbehov,
    perioderUtenInnleggelse: Period[],
    oppgittePerioder: Period[]
) => {
    if (tilsynsbehov === Tilsynsbehov.HELE) {
        return settGradAvTilsynsbehov(perioderUtenInnleggelse, GradAvTilsynsbehov.BEHOV_FOR_EN);
    } else if (tilsynsbehov === Tilsynsbehov.DELER) {
        return settGradAvTilsynsbehov(oppgittePerioder, GradAvTilsynsbehov.BEHOV_FOR_EN);
    }
};

const sammenstillPerioderMedBehovForEnEllerTo = (
    behovForTo: Tilsynsbehov,
    perioderMedTilsynsbehov: Period[],
    perioderMedBehovForTo: Period[]
): PeriodeMedGradAvTilsynsbehov[] => {
    if (behovForTo === Tilsynsbehov.HELE) {
        return settGradAvTilsynsbehov(perioderMedTilsynsbehov, GradAvTilsynsbehov.BEHOV_FOR_TO);
    } else if (behovForTo === Tilsynsbehov.DELER) {
        const perioderMedBehovForEn = [];
        perioderMedTilsynsbehov.forEach((periodeMedTilsynsbehov) => {
            perioderMedBehovForEn.push(...getPeriodDifference(periodeMedTilsynsbehov, perioderMedBehovForTo));
        });
        return [
            ...settGradAvTilsynsbehov(perioderMedBehovForEn, GradAvTilsynsbehov.BEHOV_FOR_EN),
            ...settGradAvTilsynsbehov(perioderMedBehovForTo, GradAvTilsynsbehov.BEHOV_FOR_TO),
        ];
    }
};

const sammenstillOppgittePerioderMedTilsynsbehov = (periodeTilVurdering: Period, formValues: SykdomFormState) => {
    const innleggelsesperioder = formValues[SykdomFormValue.INNLEGGELSESPERIODER];
    const perioderUtenomInnleggelsesperioder = getPeriodDifference(periodeTilVurdering, innleggelsesperioder);

    const genereltTilsynsbehov = formValues[SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN];
    const perioderMedGenereltTilsynsbehov =
        formValues[SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE];

    const behovForTo = formValues[SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER];
    const perioderMedBehovForTo = formValues[SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER];

    let allePerioderMedTilsynsbehov = [];
    if (erHeltEllerDelvisOppfylt(genereltTilsynsbehov)) {
        allePerioderMedTilsynsbehov = finnPerioderMedBehovForEnPerson(
            genereltTilsynsbehov,
            perioderUtenomInnleggelsesperioder,
            perioderMedGenereltTilsynsbehov
        );
    }

    if (erHeltEllerDelvisOppfylt(behovForTo)) {
        allePerioderMedTilsynsbehov = sammenstillPerioderMedBehovForEnEllerTo(
            behovForTo,
            perioderMedGenereltTilsynsbehov,
            perioderMedBehovForTo
        );
    }

    return allePerioderMedTilsynsbehov;
};

const VilkårsvurderingForm = ({ sykdom, onSubmit }: VilkårsvurderingFormProps): JSX.Element => {
    const { watch, handleSubmit } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const innleggelsesperioder = watch(SykdomFormValue.INNLEGGELSESPERIODER);
    const perioderUtenInnleggelse = getPeriodDifference(sykdom.periodeTilVurdering, innleggelsesperioder);

    const submitHandler = (formValues: SykdomFormState) => {
        const oppgittePerioderMedTilsynsbehov = [
            ...sammenstillOppgittePerioderMedTilsynsbehov(sykdom.periodeTilVurdering, formValues),
        ];
        const oppgitteInnleggelsesperioder = [
            ...settGradAvTilsynsbehov(innleggelsesperioder, GradAvTilsynsbehov.INNLAGT),
        ];
        onSubmit({
            ...formValues,
            perioderMedTilsynsbehov: [...oppgittePerioderMedTilsynsbehov, ...oppgitteInnleggelsesperioder],
        });
    };

    return (
        <Step onSubmit={handleSubmit(submitHandler)} buttonLabel="Bekreft vurdering">
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <hr />
            <VurderingAvTilsynsbehovForm
                sykdom={sykdom}
                innleggelsesperioder={innleggelsesperioder}
                perioderUtenInnleggelser={perioderUtenInnleggelse}
            />
            {erHeltEllerDelvisOppfylt(tilsynsbehov) && (
                <VurderingAvToOmsorgspersonerForm
                    sykdom={sykdom}
                    innleggelsesperioder={innleggelsesperioder}
                    perioderUtenInnleggelser={perioderUtenInnleggelse}
                />
            )}
        </Step>
    );
};

export default VilkårsvurderingForm;
