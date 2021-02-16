import * as React from 'react';
import ContentWithTooltip from '../../content-with-tooltip/ContentWithTooltip';
import ExclamationMarkIcon from '../../icons/ExclamationMarkIcon';
import styles from './slettetLabel.less';

const SlettetLabel = () => (
    <div className={styles.slettetLabel__container}>
        <ContentWithTooltip tooltipText="Slettet">
            <ExclamationMarkIcon />
        </ContentWithTooltip>
    </div>
);

export default SlettetLabel;
