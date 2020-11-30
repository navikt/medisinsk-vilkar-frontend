import React from 'react';
import Vurderingsvelger from '../vurderingsvelger/Vurderingsvelger';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import Vurdering from '../../../types/Vurdering';
import styles from './vurderingNavigation.less';

interface VurderingNavigationProps {
    vurderinger: Vurdering[];
    onNyVurderingClick: () => void;
    onVurderingValgt: (vurdering: Vurdering) => void;
}

const VurderingNavigation = ({ vurderinger, onNyVurderingClick, onVurderingValgt }: VurderingNavigationProps) => (
    <>
        <Undertittel>Alle perioder</Undertittel>
        <Knapp
            className={styles.nyVurderingKnapp}
            type="standard"
            htmlType="button"
            mini={true}
            onClick={() => onNyVurderingClick()}
        >
            Opprett ny vurdering
        </Knapp>
        <div className={styles.vurderingsvelgerContainer}>
            <Vurderingsvelger vurderinger={vurderinger} onVurderingValgt={onVurderingValgt} />
        </div>
    </>
);

export default VurderingNavigation;
