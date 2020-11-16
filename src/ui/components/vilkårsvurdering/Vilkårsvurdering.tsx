import React from 'react';
import VilkårsvurderingForm from '../form-vilkårsvurdering/VilkårsvurderingForm';
import Summary from '../summary/Summary';
import Step from '../step/Step';
import EndreVurderingLink from '../endre-vurdering-link/EndreVurderingLink';

const Vilkårsvurdering = () => {
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
                <Summary perioderMedTilsynsbehov={perioderMedTilsynsbehov} />
            </Step>
        );
    } else {
        return (
            <Step headerProps={{ title: stepTitle }}>
                <VilkårsvurderingForm
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
