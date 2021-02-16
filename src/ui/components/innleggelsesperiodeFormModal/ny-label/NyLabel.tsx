import * as React from 'react';
import ContentWithTooltip from '../../content-with-tooltip/ContentWithTooltip';
import styles from './nyLabel.less';

const NyLabel = () => (
    <div className={styles.nyLabel__container}>
        <ContentWithTooltip tooltipText="Ny periode lagt til nå">
            <div className={styles.nyLabel__icon}>Ny</div>
        </ContentWithTooltip>
    </div>
);

export default NyLabel;
