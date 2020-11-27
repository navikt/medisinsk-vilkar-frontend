import React from 'react';
import { hentTilsynsbehovVurderinger } from '../../../util/httpMock';
import Vurderingsoversikt from '../vurderingsoversikt/Vurderingsoversikt';
import ContainerContext from '../../context/ContainerContext';
import VurderingsdetaljerForKontinuerligTilsynOgPleie from '../vurderingsdetaljer-for-kontinuerlig-tilsyn-og-pleie/VurderingsdetaljerForKontinuerligTilsynOgPleie';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const VilkårsvurderingAvToOmsorgspersoner = () => {
    const { vurdering, onVurderingValgt } = React.useContext(ContainerContext);

    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderinger, setVurderinger] = React.useState([]);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurderinger, vurdering) || null);

    React.useEffect(() => {
        setIsLoading(true);
        hentTilsynsbehovVurderinger().then((vurderinger) => {
            setVurderinger(vurderinger);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    } else {
        return (
            <Vurderingsoversikt
                vurderinger={vurderinger}
                valgtVurdering={valgtVurdering}
                onVurderingValgt={(vurdering) => {
                    setValgtVurdering(vurdering);
                    onVurderingValgt(vurdering.id);
                }}
                vurderingsdetaljerRenderer={(valgtVurdering) => (
                    <VurderingsdetaljerForKontinuerligTilsynOgPleie vurdering={valgtVurdering} />
                )}
            />
        );
    }
};

export default VilkårsvurderingAvToOmsorgspersoner;
