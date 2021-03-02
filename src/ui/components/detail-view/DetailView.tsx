import React from 'react';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import styles from './detailView.less';
import LinkButton from '../link-button/LinkButton';

interface DetailViewProps {
    title: string;
    children: React.ReactNode;
    contentAfterTitleRenderer?: () => React.ReactNode;
}

const DetailView = ({ title, children, contentAfterTitleRenderer }: DetailViewProps) => (
    <div className={styles.detailView}>
        <TitleWithUnderline>
            {title}
            {contentAfterTitleRenderer && contentAfterTitleRenderer()}
        </TitleWithUnderline>
        {children}
    </div>
);

export default DetailView;
