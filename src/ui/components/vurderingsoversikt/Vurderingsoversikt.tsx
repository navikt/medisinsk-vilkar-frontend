import * as React from 'react';
import ContainerContext from '../../context/ContainerContext';
import Vurderingsvelger from '../vurderingsvelger/Vurderingsvelger';
import Vurderingsdetaljer from '../vurderingsdetaljer/Vurderingsdetaljer';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import styles from './vurderingsoversikt.less';

const finnValgtVurdering = (vurderinger, vurderingId) => {
    return vurderinger.find(({ id }) => vurderingId === id);
};

const Vurderingsoversikt = ({ vurderinger }) => {
    const { vurdering, onSelectVurdering } = React.useContext(ContainerContext);
    const [valgtVurdering, setValgtVurdering] = React.useState(finnValgtVurdering(vurderinger, vurdering) || null);

    return (
        <div className={styles.vurderingsoversikt}>
            <div className={styles.vurderingsoversikt__navigationSection}>
                <Undertittel>Alle perioder</Undertittel>
                <Knapp
                    className={styles.vurderingsoversikt__navigationSection__nyVurderingKnapp}
                    type="standard"
                    htmlType="button"
                    mini={true}
                >
                    Opprett ny vurdering
                </Knapp>
                <div
                    className={styles.vurderingsoversikt__vurderingsvelgerContainer}
                    style={{ flexGrow: 1, marginTop: '1rem' }}
                >
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
