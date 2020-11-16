import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import VurderingAvToOmsorgspersonerForm from '../form-vurdering-to-omsorgspersoner/VurderingAvToOmsorgspersonerForm';
import VurderingAvTilsynsbehovForm from '../form-vurdering-av-tilsynsbehov/VurderingAvTilsynsbehovForm';
import { getPeriodDifference, isValidPeriod } from '../../../util/dateUtils';
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
import Form from '../form/Form';
import SøknadsperiodeContext from '../../context/SøknadsperiodeContext';

interface VilkårsvurderingFormProps {
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

const VilkårsvurderingForm = ({ onSubmit }: VilkårsvurderingFormProps): JSX.Element => {
    const søknadsperiode = React.useContext(SøknadsperiodeContext);
    const { watch, handleSubmit } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN);

    // remove this filter when we have a proper way of putting innleggelsesperioder in form state
    const innleggelsesperioder = watch(SykdomFormValue.INNLEGGELSESPERIODER).filter(isValidPeriod);
    const perioderUtenInnleggelse = getPeriodDifference(søknadsperiode, innleggelsesperioder);

    const submitHandler = (formValues: SykdomFormState) => {
        const oppgittePerioderMedTilsynsbehov = [
            ...sammenstillOppgittePerioderMedTilsynsbehov(søknadsperiode, formValues),
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
        <Form onSubmit={handleSubmit(submitHandler)} buttonLabel="Bekreft vurdering">
            <VurderingAvTilsynsbehovForm
                innleggelsesperioder={innleggelsesperioder}
                perioderUtenInnleggelser={perioderUtenInnleggelse}
            />
            {erHeltEllerDelvisOppfylt(tilsynsbehov) && (
                <VurderingAvToOmsorgspersonerForm
                    innleggelsesperioder={innleggelsesperioder}
                    perioderUtenInnleggelser={perioderUtenInnleggelse}
                />
            )}
        </Form>
    );
};

export default VilkårsvurderingForm;
