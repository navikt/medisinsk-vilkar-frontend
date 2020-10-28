import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import SykdomFormValues from '../../../types/SykdomFormState';
import VurderingAvToOmsorgspersonerForm from '../form-vurdering-to-omsorgspersoner/VurderingAvToOmsorgspersonerForm';
import VurderingAvTilsynsbehovForm from '../form-vurdering-av-tilsynsbehov/VurderingAvTilsynsbehovForm';
import { intersectPeriods } from '../../../util/dateUtils';
import { harTilsynsbehov } from '../../../util/domain';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps): JSX.Element => {
    const { watch } = useFormContext();

    const tilsynsbehov = watch(SykdomFormValues.BEHOV_FOR_KONTINUERLIG_TILSYN);
    const innleggelsesperioder = watch(SykdomFormValues.INNLEGGELSESPERIODER);
    const perioderUtenInnleggelse = intersectPeriods(
        sykdom.periodeTilVurdering,
        innleggelsesperioder
    );

    return (
        <>
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
        </>
    );
};

export default Vilkårsvurdering;
