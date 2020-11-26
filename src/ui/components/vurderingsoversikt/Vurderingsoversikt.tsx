import * as React from 'react';
import ContainerContext from '../../context/ContainerContext';
import PeriodMenu from '../period-menu/PeriodMenu';
import VurderingDetails from '../vurdering-details/VurderingDetails';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const Vurderingsoversikt = ({ vurderinger }) => {
    const { vurdering, onSelectVurdering } = React.useContext(ContainerContext);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurderinger, vurdering) || null);

    return (
        <div style={{ display: 'flex' }}>
            <PeriodMenu
                vurderinger={vurderinger}
                onActiveVurderingChange={(nyvalgtVurdering) => {
                    setValgtVurdering(nyvalgtVurdering);
                    onSelectVurdering(nyvalgtVurdering.id);
                }}
            />
            {valgtVurdering !== null && <VurderingDetails vurdering={valgtVurdering} />}
        </div>
    );
};
export default Vurderingsoversikt;
