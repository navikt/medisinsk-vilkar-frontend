import React from 'react';
import Lenke from 'nav-frontend-lenker';
import EditIcon from '../icons/EditIcon';
import styles from './endreVurderingLink.less';

interface EndreVurderingLinkProps {
    onClick: () => void;
}

const EndreVurderingLink = ({ onClick }: EndreVurderingLinkProps) => (
    <div className={styles.endreVurderingLink}>
        <EditIcon />
        <Lenke href="#" onClick={onClick} className={styles.lenke}>
            Endre vurdering
        </Lenke>
    </div>
);

export default EndreVurderingLink;
