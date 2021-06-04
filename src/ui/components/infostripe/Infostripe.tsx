import * as React from 'react';
import { ChildIcon } from '@navikt/k9-react-components';
import styles from './infostripe.less';

const Infostripe = () => (
    <div className={styles.infostripe}>
        <div className={styles.infostripe__iconContainer}>
            <ChildIcon />
        </div>
        <div className={styles.infostripe__textContainer}>
            <p className={styles.infostripe__text}>Sykdomsvurderingen gjøres på barnet og er felles for alle parter.</p>
        </div>
    </div>
);

export default Infostripe;
