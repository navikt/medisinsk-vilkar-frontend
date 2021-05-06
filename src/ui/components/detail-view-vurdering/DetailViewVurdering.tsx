import React from 'react';
import DetailView, { DetailViewProps } from '../detail-view/DetailView';
import { Period } from '../../../types/Period';
import PeriodList from '../period-list/PeriodList';
import styles from './detailViewVurdering.less';
import { isValidPeriod } from '../../../util/dateUtils';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import LinkButton from '../link-button/LinkButton';

interface DetailViewVurderingProps extends DetailViewProps {
    perioder: Period[];
    redigerVurdering?: () => void;
}

const DetailViewVurdering = (props: DetailViewVurderingProps) => {
    const { children, perioder, redigerVurdering, ...detailViewProps } = props;
    const harPerioder = perioder.length > 0 && isValidPeriod(perioder[0]);
    return (
        <DetailView
            {...detailViewProps}
            className={styles.detailViewVurdering}
            contentAfterTitleRenderer={() =>
                redigerVurdering && (
                    <WriteAccessBoundContent
                        contentRenderer={() => (
                            <LinkButton className={styles.detailViewVurdering__endreLink} onClick={redigerVurdering}>
                                Rediger vurdering
                            </LinkButton>
                        )}
                    />
                )
            }
        >
            {harPerioder && <PeriodList periods={perioder} className={styles.detailViewVurdering__periodList} />}
            <hr className={styles.detailViewVurdering__hr} />
            {children}
        </DetailView>
    );
};

export default DetailViewVurdering;
