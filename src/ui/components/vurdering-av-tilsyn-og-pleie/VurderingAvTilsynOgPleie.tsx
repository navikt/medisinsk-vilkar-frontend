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

    return (
        <div style={{ padding: '1rem' }}>
            {isLoading === true && <p>Laster vurderinger</p>}
            {isLoading === false && <Vurderingsoversikt vurderinger={vurderinger} />}
        </div>
    );
};

export default VurderingAvTilsynOgPleie;
