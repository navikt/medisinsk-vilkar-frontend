import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';
import styles from './detailView.less';

interface DetailViewProps {
    title: string;
    children: React.ReactNode;
    renderNextToTitle?: () => React.ReactNode;
}

const DetailView = ({ title, children, renderNextToTitle }: DetailViewProps) => (
    <div className={styles.detailView}>
        <div className={styles.detailView__titleContainer}>
            <Undertittel>{title}</Undertittel>
            {renderNextToTitle && (
                <div className={styles.detailView__nextToTitle}>
                    <div className={styles.detailView__separator}>-</div>
                    {renderNextToTitle()}
                </div>
            )}
        </div>
        {children}
    </div>
);

export default DetailView;
