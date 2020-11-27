import React from 'react';
import { getVurderinger } from '../../../util/httpMock';
import Vurderingsoversikt from '../vurderingsoversikt/Vurderingsoversikt';

const VurderingAvTilsynOgPleie = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [vurderinger, setVurderinger] = React.useState([]);

    const hentVurderinger = () =>
        getVurderinger().then((value) => {
            setVurderinger(value);
            setIsLoading(false);
        });

    React.useEffect(() => {
        hentVurderinger();
    }, []);

    if (isLoading) {
        return <p>Laster vurderinger</p>;
    } else {
        return <Vurderingsoversikt vurderinger={vurderinger} />;
    }
};

export default VurderingAvTilsynOgPleie;
