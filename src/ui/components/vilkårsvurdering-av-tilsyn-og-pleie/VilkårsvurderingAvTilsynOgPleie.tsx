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
    const [vurderingsoversikt, setVurderingsoversikt] = React.useState<Vurderingsoversikt>(null);
    const [valgtVurdering, setValgtVurdering] = React.useState(null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        hentTilsynsbehovVurderingsoversikt().then((vurderingsoversikt: Vurderingsoversikt) => {
            setVurderingsoversikt(vurderingsoversikt);
            setValgtVurdering(finnValgtVurdering(vurderingsoversikt.vurderinger, vurdering) || null);
            setIsLoading(false);
        });
    }, []);

    const velgVurdering = (v: Vurdering) => {
        if (v === null) {
            onVurderingValgt(null);
            setValgtVurdering(null);
            setNyVurderingOpen(true);
        } else {
            onVurderingValgt(v.id);
            setValgtVurdering(v);
            setNyVurderingOpen(false);
        }
    };

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    }
    return (
        <NavigationWithDetailView
            navigationSection={() => (
                <VurderingNavigation
                    vurderinger={vurderingsoversikt?.vurderinger}
                    perioderSomSkalVurderes={vurderingsoversikt?.perioderSomSkalVurderes}
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
    );
};

export default VilkårsvurderingAvTilsynOgPleie;
