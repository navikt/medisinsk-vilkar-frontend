import React from 'react';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import VilkårsvurderingForm from '../form-vilkårsvurdering/VilkårsvurderingForm';
import Summary from '../summary/Summary';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps) => {
    const [shouldShowSummary, setShouldShowSummary] = React.useState(false);
    const [perioderMedTilsynsbehov, setPerioderMedTilsynsbehov] = React.useState(null);

    if (shouldShowSummary) {
        return <Summary perioderMedTilsynsbehov={perioderMedTilsynsbehov} sykdom={sykdom} />;
    } else {
        return (
            <VilkårsvurderingForm
                sykdom={sykdom}
                onSubmit={(data) => {
                    setPerioderMedTilsynsbehov(data.perioderMedTilsynsbehov);
                    setShouldShowSummary(true);
                }}
            />
        );
    }
};

export default Vilkårsvurdering;
