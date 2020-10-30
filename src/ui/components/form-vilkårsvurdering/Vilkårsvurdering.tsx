import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Systemtittel } from 'nav-frontend-typografi';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import SykdomFormValues from '../../../types/SykdomFormState';
import VurderingAvToOmsorgspersonerForm from '../form-vurdering-to-omsorgspersoner/VurderingAvToOmsorgspersonerForm';
import VurderingAvTilsynsbehovForm from '../form-vurdering-av-tilsynsbehov/VurderingAvTilsynsbehovForm';
import { intersectPeriods } from '../../../util/dateUtils';
import { harTilsynsbehov } from '../../../util/domain';
import Box, { Margin } from '../box/Box';

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
            <Systemtittel>Vurdering av tilsyn og pleie</Systemtittel>
            <hr />
            <VurderingAvTilsynsbehovForm
                sykdom={sykdom}
                innleggelsesperioder={innleggelsesperioder}
                perioderUtenInnleggelser={perioderUtenInnleggelse}
            />
            {harTilsynsbehov(tilsynsbehov) && (
                <Box marginTop={Margin.xLarge}>
                    <VurderingAvToOmsorgspersonerForm
                        sykdom={sykdom}
                        innleggelsesperioder={innleggelsesperioder}
                        perioderUtenInnleggelser={perioderUtenInnleggelse}
                    />
                </Box>
            )}
        </>
    );
};

export default Vilkårsvurdering;
