import React from 'react';
import PeriodMenu from './components/period-menu/PeriodMenu';
import genereltTilsynsbehovVurderingerMock from '../mock/mockedVurderinger';
import VurderingDetails from './components/vurdering-details/VurderingDetails';
import ContainerContext from './context/ContainerContext';

const finnValgtVurdering = (vurderingId) => {
    return genereltTilsynsbehovVurderingerMock.find(({ id }) => vurderingId === id);
};

const NewVersion = () => {
    const { vurdering, onSelectVurdering } = React.useContext(ContainerContext);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurdering) || null);
    return (
        <div style={{ padding: '4rem', display: 'flex' }}>
            <PeriodMenu
                vurderinger={genereltTilsynsbehovVurderingerMock}
                onActiveVurderingChange={(vurdering) => {
                    setValgtVurdering(vurdering);
                    onSelectVurdering(vurdering.id);
                }}
            />
            {valgtVurdering !== null && <VurderingDetails vurdering={valgtVurdering} />}
        </div>
    );
};

export default NewVersion;
