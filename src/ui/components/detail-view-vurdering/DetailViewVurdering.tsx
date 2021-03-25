import React from 'react';
import DetailView, { DetailViewProps } from '../detail-view/DetailView';
import styles from '../detail-view/detailView.less';

const DetailViewVurdering = (props: DetailViewProps) => (
    <DetailView
        {...props}
        contentAfterTitleRenderer={() => (
            <>
                <div className={styles.detailView__separator}>-</div>
                {props.contentAfterTitleRenderer()}
            </>
        )}
    />
);

export default DetailViewVurdering;
