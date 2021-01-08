import { EtikettInfo } from 'nav-frontend-etiketter';
import React from 'react';
import styles from './nyVurdering.less';

const NyVurdering = () => {
    return (
        <div className={styles.nyVurdering}>
            <EtikettInfo mini={true}>Ny vurdering</EtikettInfo>
        </div>
    );
};

export default NyVurdering;
