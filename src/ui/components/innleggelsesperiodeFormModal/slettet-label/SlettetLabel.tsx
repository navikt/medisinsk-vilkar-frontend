import * as React from 'react';
import IconWithTooltip from '../../content-with-tooltip/ContentWithTooltip';
import ExclamationMarkIcon from '../../icons/ExclamationMarkIcon';
import styles from './slettetLabel.less';

const SlettetLabel = () => (
    <div className={styles.slettetLabel__container}>
        <IconWithTooltip tooltipText="Slettet">
            <ExclamationMarkIcon />
        </IconWithTooltip>
    </div>
);

export default SlettetLabel;
