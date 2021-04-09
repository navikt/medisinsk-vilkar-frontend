import React from 'react';
import DetailView, { DetailViewProps } from '../detail-view/DetailView';
import { Period } from '../../../types/Period';
import PeriodList from '../period-list/PeriodList';
import styles from './detailViewVurdering.less';
import { isValidPeriod } from '../../../util/dateUtils';

interface DetailViewVurderingProps extends DetailViewProps {
    perioder: Period[];
}

const DetailViewVurdering = (props: DetailViewVurderingProps) => {
    const { children, perioder, ...detailViewProps } = props;
    const harPerioder = perioder.length > 0 && isValidPeriod(perioder[0]);
    return (
        <DetailView {...detailViewProps} className={styles.detailViewVurdering}>
            {harPerioder && <PeriodList periods={perioder} className={styles.detailViewVurdering__periodList} />}
            <hr className={styles.detailViewVurdering__hr} />
            {children}
        </DetailView>
    );
};

export default DetailViewVurdering;
