import React from 'react';
import { hentToOmsorgspersonerVurderinger } from '../../../util/httpMock';
import VurderingsdetaljerForToOmsorgspersoner from '../vurderingsdetaljer-for-to-omsorgspersoner/VurderingsdetaljerForToOmsorgspersoner';
import Vurderingsoversikt from '../vurderingsoversikt/Vurderingsoversikt';
import ContainerContext from '../../context/ContainerContext';

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
        hentToOmsorgspersonerVurderinger().then((vurderinger) => {
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
                    <VurderingsdetaljerForToOmsorgspersoner vurdering={valgtVurdering} />
                )}
            />
        );
    }
};

export default VilkårsvurderingAvToOmsorgspersoner;
