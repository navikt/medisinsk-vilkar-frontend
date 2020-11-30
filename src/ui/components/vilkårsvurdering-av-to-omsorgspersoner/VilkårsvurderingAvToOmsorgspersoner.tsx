import React from 'react';
import { hentToOmsorgspersonerVurderinger } from '../../../util/httpMock';
import ContainerContext from '../../context/ContainerContext';
import NavigationWithDetailView from '../navigation-with-detail-view/NavigationWithDetailView';
import VurderingNavigation from '../vurdering-navigation/VurderingNavigation';
import Vurdering from '../../../types/Vurdering';
import NyVurderingAvToOmsorgspersoner from '../ny-vurdering-av-to-omsorgspersoner/NyVurderingAvToOmsorgspersoner';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const VilkårsvurderingAvToOmsorgspersoner = () => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderinger, setVurderinger] = React.useState([]);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurderinger, vurdering) || null);
    const [nyVurderingOpen, setNyVurderingOpen] = React.useState(false);

    React.useEffect(() => {
        setIsLoading(true);
        hentToOmsorgspersonerVurderinger().then((vurderinger) => {
            setVurderinger(vurderinger);
            setIsLoading(false);
        });
    }, []);

    const velgVurdering = (vurdering: Vurdering) => {
        onVurderingValgt(vurdering.id);
        setValgtVurdering(vurdering);
        setNyVurderingOpen(false);
    };

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    } else {
        return (
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
                        return <NyVurderingAvToOmsorgspersoner />;
                    } else if (valgtVurdering !== null) {
                        return <VurderingsdetaljerForToOmsorgspersoner vurdering={valgtVurdering} />;
                    }
                    return null;
                }}
            />
        );
    }
};

export default VilkårsvurderingAvToOmsorgspersoner;
