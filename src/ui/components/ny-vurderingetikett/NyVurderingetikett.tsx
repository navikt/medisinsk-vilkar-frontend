import { EtikettInfo } from 'nav-frontend-etiketter';
import React from 'react';
import styles from './nyVurderingetikett.less';

const NyVurderingetikett = () => {
    return (
        <div className={styles.nyVurderingetikett}>
            <EtikettInfo mini={true}>Ny vurdering</EtikettInfo>
        </div>
    );
};

export default NyVurderingetikett;
