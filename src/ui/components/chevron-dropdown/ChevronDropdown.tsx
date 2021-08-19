import React, { useState } from 'react';
import { Element } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import classNames from 'classnames';
import styles from './chevronDropdown.less';

interface ChevronDropdownProps {
    text: string;
    className: string;
}

function ChevronDropdown({ text, className }: ChevronDropdownProps): JSX.Element {
    const [aktiv, settAktiv] = useState(false);
    const type = aktiv ? 'opp' : 'ned';
    return (
        <span className={classNames(styles.chevronDropdown, className)}>
            <button type="button" onClick={() => settAktiv(!aktiv)}>
                <Element className={styles.chevronDropdown__text}>{text}</Element>
                <Chevron type={type} />
            </button>
        </span>
    );
}

export default ChevronDropdown;
