import React from 'react';
import Vurderingsoversikt from '../vurderingsoversikt/Vurderingsoversikt';
import Vurdering from '../../../types/Vurdering';

interface VilkårsvurderingProps {
    hentVurderinger: () => Promise<Vurdering[]>;
    vurderingsdetaljerRenderer: (valgtVurdering) => React.ReactNode;
}

const Vilkårsvurdering = ({ hentVurderinger, vurderingsdetaljerRenderer }: VilkårsvurderingProps) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderinger, setVurderinger] = React.useState([]);

    React.useEffect(() => {
        setIsLoading(true);
        hentVurderinger().then((vurderinger) => {
            setVurderinger(vurderinger);
            setIsLoading(false);
        });
    }, []);

    if (isLoading) {
        return <p>Henter vurderinger</p>;
    } else {
        return <Vurderingsoversikt vurderinger={vurderinger} vurderingsdetaljerRenderer={vurderingsdetaljerRenderer} />;
    }
};

export default Vilkårsvurdering;
