import * as React from 'react';
import IconWithTooltip from '../../icon-with-tooltip/IconWithTooltip';
import ExclamationMarkIcon from '../../icons/ExclamationMarkIcon';
import styles from './slettetLabel.less';

const SlettetLabel = () => (
    <div className={styles.slettetLabel__container}>
        <IconWithTooltip renderIcon={() => <ExclamationMarkIcon />} tooltipText="Slettet" />
    </div>
);

export default SlettetLabel;
