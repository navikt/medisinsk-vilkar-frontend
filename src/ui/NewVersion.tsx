import React from 'react';
import { getVurderinger } from '../util/httpMock';
import Vurderingsoversikt from './components/vurderingsoversikt/Vurderingsoversikt';

const NewVersion = () => {
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
        <div style={{ padding: '4rem' }}>
            {isLoading ? (
                <p>Laster vurderinger</p>
            ) : (
                <Vurderingsoversikt
                    vurderinger={vurderinger}
                    onVurderingChange={() => {
                        setIsLoading(true);
                        hentVurderinger();
                    }}
                />
            )}
        </div>
    );
};

export default NewVersion;
