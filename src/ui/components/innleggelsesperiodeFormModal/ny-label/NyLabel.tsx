import * as React from 'react';
import IconWithTooltip from '../../icon-with-tooltip/IconWithTooltip';
import styles from './nyLabel.less';

const NyLabel = () => (
    <div className={styles.nyLabel__container}>
        <IconWithTooltip
            renderIcon={() => <div className={styles.nyLabel__icon}>Ny</div>}
            tooltipText="Ny periode lagt til nå"
        />
    </div>
);

export default NyLabel;
