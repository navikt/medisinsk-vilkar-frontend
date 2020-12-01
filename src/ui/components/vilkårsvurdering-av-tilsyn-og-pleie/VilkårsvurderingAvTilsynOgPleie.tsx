import React from 'react';
import Vurdering from '../../../types/Vurdering';
import { hentTilsynsbehovVurderingsoversikt } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingAvTilsynsbehovForm from '../ny-vurdering-av-tilsynsbehov/VurderingAvTilsynsbehovForm';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import VurderingsdetaljerForKontinuerligTilsynOgPleie from '../vurderingsdetaljer-for-kontinuerlig-tilsyn-og-pleie/VurderingsdetaljerForKontinuerligTilsynOgPleie';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const VilkårsvurderingAvTilsynOgPleie = () => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderinger, setVurderinger] = React.useState([]);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurderinger, vurdering) || null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        hentTilsynsbehovVurderingsoversikt().then(({ vurderinger }: Vurderingsoversikt) => {
            setVurderinger(vurderinger);
            setIsLoading(false);
        });
    }, []);

    const velgVurdering = (v: Vurdering) => {
        onVurderingValgt(v.id);
        setValgtVurdering(v);
        setNyVurderingOpen(false);
    };

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <>
            <NavigationWithDetailView
                navigationSection={() => (
                    <VurderingNavigation
                        vurderinger={vurderinger}
                        onVurderingValgt={velgVurdering}
                        onNyVurderingClick={() => setNyVurderingOpen(true)}
                    />
                )}
                detailSection={() => {
                    if (nyVurderingOpen) {
                        return <VurderingAvTilsynsbehovForm />;
                    }
                    if (valgtVurdering !== null) {
                        return <VurderingsdetaljerForKontinuerligTilsynOgPleie vurdering={valgtVurdering} />;
                    }
                    return null;
                }}
            />
        </>
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
