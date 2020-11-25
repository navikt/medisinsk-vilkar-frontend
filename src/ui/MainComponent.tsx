import React from 'react';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import { Period } from '../types/Period';
import SøknadsperiodeContext from './context/SøknadsperiodeContext';
import SykdomContent from './components/sykdom-content/SykdomContent';
import Søknadsperiodevelger from './components/søknadsperiodevelger/Søknadsperiodevelger';

interface MainComponentProps {
    sykdom: Sykdom;
}

const MainComponent = ({ sykdom: { søknadsperioder } }: MainComponentProps): JSX.Element => {
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

export default MainComponent;
