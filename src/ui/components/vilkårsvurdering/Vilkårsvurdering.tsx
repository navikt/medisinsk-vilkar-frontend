import React from 'react';
import Sykdom from '../../../types/medisinsk-vilkår/sykdom';
import VilkårsvurderingForm from '../form-vilkårsvurdering/VilkårsvurderingForm';
import Summary from '../summary/Summary';
import Step from '../step/Step';
import EndreVurderingLink from '../endre-vurdering-link/EndreVurderingLink';

interface VilkårsvurderingProps {
    sykdom: Sykdom;
}

const Vilkårsvurdering = ({ sykdom }: VilkårsvurderingProps) => {
    const [shouldShowSummary, setShouldShowSummary] = React.useState(false);
    const [perioderMedTilsynsbehov, setPerioderMedTilsynsbehov] = React.useState(null);

    const stepTitle = 'Vurdering av tilsyn og pleie';
    if (shouldShowSummary) {
        return (
            <Step
                headerProps={{
                    title: stepTitle,
                    contentRenderer: () => <EndreVurderingLink onClick={() => setShouldShowSummary(false)} />,
                }}
            >
                <Summary perioderMedTilsynsbehov={perioderMedTilsynsbehov} sykdom={sykdom} />
            </Step>
        );
    } else {
        return (
            <Step headerProps={{ title: stepTitle }}>
                <VilkårsvurderingForm
                    sykdom={sykdom}
                    onSubmit={(data) => {
                        setPerioderMedTilsynsbehov(data.perioderMedTilsynsbehov);
                        setShouldShowSummary(true);
                    }}
                />
            </Step>
        );
    }
};

export default Vilkårsvurdering;
