import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Systemtittel } from 'nav-frontend-typografi';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import VurderingAvToOmsorgspersonerForm from '../form-vurdering-to-omsorgspersoner/VurderingAvToOmsorgspersonerForm';
import VurderingAvTilsynsbehovForm from '../form-vurdering-av-tilsynsbehov/VurderingAvTilsynsbehovForm';
import { intersectPeriods } from '../../../util/dateUtils';
import { harTilsynsbehov as harTilsynsbehovUtil } from '../../../util/domain';
import Step from '../step/Step';
import SykdomFormState, { SykdomFormValue } from '../../../types/SykdomFormState';
import Tilsynsbehov from '../../../types/Tilsynsbehov';

interface VilkårsvurderingFormProps {
    sykdom: Sykdom;
    onSubmit: (d) => void;
}

const VilkårsvurderingForm = ({ sykdom, onSubmit }: VilkårsvurderingFormProps): JSX.Element => {
    const { watch, handleSubmit } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const innleggelsesperioder = watch(SykdomFormValue.INNLEGGELSESPERIODER);
    const perioderUtenInnleggelse = intersectPeriods(
        sykdom.periodeTilVurdering,
        innleggelsesperioder
    );

    // todo: replace function with proper form state alteration
    const submitHandler = (data: SykdomFormState) => {
        const transformedData: SykdomFormState = { ...data };

        const harSpesifisertPerioderMedGenereltTilsynsbehov =
            data[SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN] === Tilsynsbehov.DELER;
        if (!harSpesifisertPerioderMedGenereltTilsynsbehov) {
            const harTilsynsbehov = harTilsynsbehovUtil(
                data[SykdomFormValue.BEHOV_FOR_KONTINUERLIG_TILSYN]
            );
            if (harTilsynsbehov) {
                transformedData[
                    SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE
                ] = perioderUtenInnleggelse;
            } else {
                transformedData[
                    SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE
                ] = [];
            }
        }

        if (data[SykdomFormValue.BEHOV_FOR_TO_OMSORGSPERSONER] === Tilsynsbehov.HELE) {
            transformedData[SykdomFormValue.PERIODER_MED_BEHOV_FOR_TO_OMSORGSPERSONER] =
                transformedData[
                    SykdomFormValue.PERIODER_MED_BEHOV_FOR_KONTINUERLIG_TILSYN_OG_PLEIE
                ];
        }

        onSubmit(transformedData);
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
            {harTilsynsbehovUtil(tilsynsbehov) && (
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
