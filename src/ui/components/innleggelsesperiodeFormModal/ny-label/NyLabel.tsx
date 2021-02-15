import * as React from 'react';
import IconWithTooltip from '../../content-with-tooltip/ContentWithTooltip';
import styles from './nyLabel.less';

const NyLabel = () => (
    <div className={styles.nyLabel__container}>
        <IconWithTooltip tooltipText="Ny periode lagt til nå">
            <div className={styles.nyLabel__icon}>Ny</div>
        </IconWithTooltip>
    </div>
);

export default NyLabel;
