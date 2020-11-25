import React from 'react';
import Søknadsperiodevelger from './components/søknadsperiodevelger/Søknadsperiodevelger';
import SøknadsperiodeContext from './context/SøknadsperiodeContext';
import { Period } from '../types/Period';
import SykdomContent from './components/sykdom-content/SykdomContent';
import Sykdom from '../types/medisinsk-vilkår/sykdom';

interface OldVersionProps {
    sykdom: Sykdom;
}

const OldVersion = ({ sykdom: { søknadsperioder } }: OldVersionProps) => {
    const [valgtSøknadsperiode, setValgtSøknadsperiode] = React.useState(søknadsperioder[0]);

    return (
        <div style={{ display: 'flex', padding: '2rem' }}>
            <Søknadsperiodevelger søknadsperioder={søknadsperioder} onSøknadsperiodeClick={setValgtSøknadsperiode} />
            <SøknadsperiodeContext.Provider value={new Period(valgtSøknadsperiode.fom, valgtSøknadsperiode.tom)}>
                <SykdomContent />
            </SøknadsperiodeContext.Provider>
        </div>
    );
};

export default OldVersion;
