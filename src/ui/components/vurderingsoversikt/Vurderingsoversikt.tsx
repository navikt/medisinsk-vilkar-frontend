import * as React from 'react';
import Vurderingsvelger from '../vurderingsvelger/Vurderingsvelger';
import { Undertittel } from 'nav-frontend-typografi';
import { Knapp } from 'nav-frontend-knapper';
import Vurdering from '../../../types/Vurdering';
import styles from './vurderingsoversikt.less';

interface VurderingsoversiktProps {
    periode;
    vurderinger: Vurdering[];
    valgtVurdering: Vurdering;
    vurderingsdetaljerRenderer: (valgtVurdering: Vurdering) => React.ReactNode;
    onVurderingValgt: (vurdering: Vurdering) => void;
    nyVurderingRenderer: () => React.ReactNode;
}

const Vurderingsoversikt = ({
    vurderinger,
    valgtVurdering,
    vurderingsdetaljerRenderer,
    onVurderingValgt,
    nyVurderingRenderer,
}: VurderingsoversiktProps) => {
    const [nyVurderingIsOpen, setNyVurderingIsOpen] = React.useState(false);
    return (
        <div className={styles.vurderingsoversikt}>
            <div className={styles.vurderingsoversikt__navigationSection}>
                <Undertittel>Alle perioder</Undertittel>
                <Knapp
                    className={styles.vurderingsoversikt__navigationSection__nyVurderingKnapp}
                    type="standard"
                    htmlType="button"
                    mini={true}
                    onClick={() => setNyVurderingIsOpen(!nyVurderingIsOpen)}
                >
                    Opprett ny vurdering
                </Knapp>
                <div className={styles.vurderingsoversikt__vurderingsvelgerContainer}>
                    <Vurderingsvelger vurderinger={vurderinger} onVurderingValgt={onVurderingValgt} />
                </div>
            </div>
            {valgtVurdering !== null && (
                <div className={styles.vurderingsoversikt__detailSection}>
                    {vurderingsdetaljerRenderer(valgtVurdering)}
                </div>
            )}
        </div>
    );
};

export default Vurderingsoversikt;
