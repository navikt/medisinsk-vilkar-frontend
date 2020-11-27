import * as React from 'react';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsvelger from '../vurderingsvelger/Vurderingsvelger';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const Vurderingsoversikt = ({ vurderinger }) => {
    const { vurdering, onSelectVurdering } = React.useContext(ContainerContext);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurderinger, vurdering) || null);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '500px' }}>
                <Undertittel>Alle perioder</Undertittel>
                <Knapp type="standard" htmlType="button" mini={true} style={{ marginLeft: 'auto' }}>
                    Opprett ny vurdering
                </Knapp>
                <div style={{ flexGrow: 1, marginTop: '1rem' }}>
                    <Vurderingsvelger
                        vurderinger={vurderinger}
                        onActiveVurderingChange={(nyvalgtVurdering) => {
                            setValgtVurdering(nyvalgtVurdering);
                            onSelectVurdering(nyvalgtVurdering.id);
                        }}
                    />
                </div>
            </div>
            {valgtVurdering !== null && <Vurderingsdetaljer vurdering={valgtVurdering} />}
        </div>
    );
};
export default Vurderingsoversikt;
