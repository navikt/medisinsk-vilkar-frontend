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
import { harTilsynsbehov } from '../../../util/domain';
import { Period } from '../../../types/Period';
import PeriodeMedTilsynsbehov from '../../../types/PeriodeMedTilsynsbehov';
import GradAvTilsynsbehov from '../../../types/GradAvTilsynsbehov';

interface VilkårsvurderingFormProps {
    sykdom: Sykdom;
    onSubmit: (d) => void;
}

const sammenstillPerioderMedTilsynsbehov = (
    perioderMedTilsynsbehov: Period[],
    perioderMedBehovForTo: Period[]
): PeriodeMedTilsynsbehov[] => {
    const perioderMedBehovForEn = [];
    perioderMedTilsynsbehov.forEach((periodeMedTilsynsbehov) => {
        perioderMedBehovForEn.push(...getPeriodDifference(periodeMedTilsynsbehov, perioderMedBehovForTo));
    });
    return [
        ...perioderMedBehovForEn.map((periode) => ({ periode, grad: GradAvTilsynsbehov.BEHOV_FOR_EN })),
        ...perioderMedBehovForTo.map((periode) => ({ periode, grad: GradAvTilsynsbehov.BEHOV_FOR_TO })),
    ];
};

const lagPeriodeMedTilsynsbehov = (periode: Period, grad: GradAvTilsynsbehov): PeriodeMedTilsynsbehov => {
    return {
        periode,
        grad,
    };
};

const lagPeriodeMedBehovForEnTilsynsperson = (periode: Period): PeriodeMedTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.BEHOV_FOR_EN);
};

const lagPeriodeMedBehovForToTilsynspersoner = (periode: Period): PeriodeMedTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.BEHOV_FOR_TO);
};

const lagPeriodeMedIngenTilsynsbehov = (periode: Period): PeriodeMedTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.IKKE_BEHOV);
};

const lagPeriodeMedInnleggelse = (periode: Period): PeriodeMedTilsynsbehov => {
    return lagPeriodeMedTilsynsbehov(periode, GradAvTilsynsbehov.INNLAGT);
};

const VilkårsvurderingForm = ({ sykdom, onSubmit }: VilkårsvurderingFormProps): JSX.Element => {
    const { watch, handleSubmit } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const innleggelsesperioder = watch(SykdomFormValue.INNLEGGELSESPERIODER);
    const perioderUtenInnleggelse = getPeriodDifference(sykdom.periodeTilVurdering, innleggelsesperioder);

    const submitHandler = (data: SykdomFormState) => {
        const tilsynsbehov = data[SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN];

        let perioderMedTilsynsbehov: PeriodeMedTilsynsbehov[] = [];
        if (tilsynsbehov === Tilsynsbehov.HELE) {
            perioderMedTilsynsbehov = perioderUtenInnleggelse.map(lagPeriodeMedBehovForEnTilsynsperson);
        } else if (tilsynsbehov === Tilsynsbehov.DELER) {
            const oppgittePerioder = data[SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE];
            perioderMedTilsynsbehov = oppgittePerioder.map(lagPeriodeMedBehovForEnTilsynsperson);
        }

        if (harTilsynsbehov(tilsynsbehov)) {
            const tilsynsbehovToPersoner = data[SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER];
            const perioder = perioderMedTilsynsbehov.map(({ periode }) => periode);
            if (tilsynsbehovToPersoner === Tilsynsbehov.HELE) {
                perioderMedTilsynsbehov = perioder.map(lagPeriodeMedBehovForToTilsynspersoner);
            } else if (tilsynsbehovToPersoner === Tilsynsbehov.DELER) {
                const perioderMedBehovForTo = data[SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER];
                perioderMedTilsynsbehov = sammenstillPerioderMedTilsynsbehov(perioder, perioderMedBehovForTo);
            }
        }

        onSubmit({
            ...data,
            perioderMedTilsynsbehov: [
                ...perioderMedTilsynsbehov,
                ...innleggelsesperioder.map(lagPeriodeMedInnleggelse),
            ],
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
            {harTilsynsbehov(tilsynsbehov) && (
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
