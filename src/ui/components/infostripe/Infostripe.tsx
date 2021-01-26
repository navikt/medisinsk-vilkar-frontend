import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import ChildIcon from '../icons/ChildIcon';
import styles from './infostripe.less';

const Infostripe = () => (
    <div className={styles.infostripe}>
        <div className={styles.infostripe__iconContainer}>
            <ChildIcon />
        </div>
        <div className={styles.infostripe__textContainer}>
            <p className={styles.infostripe__text}>Sykdomsvurderingen gjøres på barnet og er felles for alle parter.</p>
            <p className={styles.infostripe__text}>
                Barnets alder: <Element tag="span">5 år</Element>
            </p>
            <p className={styles.infostripe__text}>
                Diagnose: <Element tag="span">Kode mangler</Element>
            </p>
        </div>
    </div>
);

export default Infostripe;
