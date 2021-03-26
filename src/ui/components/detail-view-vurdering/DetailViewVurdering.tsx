import React from 'react';
import DetailView, { DetailViewProps } from '../detail-view/DetailView';
import { Period } from '../../../types/Period';
import PeriodList from '../period-list/PeriodList';
import styles from './detailViewVurdering.less';

interface DetailViewVurderingProps extends DetailViewProps {
    perioder: Period[];
}

const DetailViewVurdering = (props: DetailViewVurderingProps) => {
    const { children, perioder, ...detailViewProps } = props;
    return (
        <DetailView {...detailViewProps} className={styles.detailViewVurdering}>
            <PeriodList periods={perioder} className={styles.detailViewVurdering__periodList} />
            <hr className={styles.detailViewVurdering__hr} />
            {children}
        </DetailView>
    );
};

export default DetailViewVurdering;
