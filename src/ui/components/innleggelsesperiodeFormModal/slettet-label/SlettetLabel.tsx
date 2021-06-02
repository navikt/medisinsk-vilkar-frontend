import { ContentWithTooltip } from '@navikt/k9-react-components';
import * as React from 'react';
import ExclamationMarkIcon from '../../icons/ExclamationMarkIcon';
import styles from './slettetLabel.less';

const SlettetLabel = () => (
    <div className={styles.slettetLabel__container}>
        <ContentWithTooltip tooltipText="Slettet">
            <ExclamationMarkIcon />
        </ContentWithTooltip>
    </div>
);

export default SlettetLabel;
