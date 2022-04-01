import { DetailView, DetailViewProps, LinkButton } from '@navikt/k9-react-components';
import React from 'react';
import { Period } from '@navikt/k9-period-utils';
import PeriodList from '../period-list/PeriodList';
import styles from './detailViewVurdering.less';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import ContainerContext from '../../context/ContainerContext';
import BehandlingType from '../../../constants/BehandlingType';

interface DetailViewVurderingProps extends DetailViewProps {
    perioder: Period[];
    redigerVurdering?: () => void;
}

const DetailViewVurdering = (props: DetailViewVurderingProps): JSX.Element => {
    const { children, perioder, redigerVurdering, title } = props;
    const { behandlingType } = React.useContext(ContainerContext);
    const harPerioder = perioder.length > 0 && perioder[0].isValid();

    const skalViseRedigerVurderingKnapp = behandlingType !== BehandlingType.REVURDERING;

    return (
        <DetailView
            title={title}
            className={styles.detailViewVurdering}
            contentAfterTitleRenderer={() =>
                redigerVurdering && (
                    <WriteAccessBoundContent
                        contentRenderer={() => (
                            <>
                                {skalViseRedigerVurderingKnapp && (
                                    <LinkButton className={styles.detailViewVurdering__endreLink} onClick={redigerVurdering}>
                                        Rediger vurdering
                                    </LinkButton>
                                )}
                            </>
                        )}
                    />
                )
            }
        >
            {harPerioder && <PeriodList periods={perioder} className={styles.detailViewVurdering__periodList} />}
            <hr className={styles.detailViewVurdering__hr} />
            {children}
        </DetailView >
    );
};

export default DetailViewVurdering;
