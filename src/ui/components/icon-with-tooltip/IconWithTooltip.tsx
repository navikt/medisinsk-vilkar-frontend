import * as React from 'react';
import styles from './iconWithTooltip.less';

interface IconWithTooltipProps {
    renderIcon: () => React.ReactNode;
    tooltipText: string;
}

const IconWithTooltip = ({ renderIcon, tooltipText }: IconWithTooltipProps): JSX.Element => (
    <div className={styles.iconWithTooltip}>
        {renderIcon()}
        <div className={styles.tooltip}>{tooltipText}</div>
    </div>
);

export default IconWithTooltip;
