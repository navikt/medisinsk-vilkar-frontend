import React from 'react';
import GreenCheckIcon from '../icons/GreenCheckIcon';
import RedCrossIcon from '../icons/RedCrossIcon';
import styles from './statusPanel.less';

export enum StatusPanelTheme {
    SUCCESS = 'success',
    ALERT = 'alert',
}

interface StatusPanelProps {
    theme: StatusPanelTheme;
}

const StatusPanel = ({ theme }: StatusPanelProps) => {
    const statusPanelBorder = styles.statusPanel__border;
    const statusPanelTheme = `statusPanel__border--${theme}`;
    return (
        <div className={styles.statusPanel}>
            <div className={`${statusPanelBorder} ${styles[statusPanelTheme]}`}></div>
            <GreenCheckIcon />
            <RedCrossIcon />
        </div>
    );
};

export default StatusPanel;
