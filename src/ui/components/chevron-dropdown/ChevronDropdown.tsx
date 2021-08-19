import React, { useState } from 'react';
import { Element } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
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
        <>
            <span className={classNames(styles.chevronDropdown, className, aktiv && styles.chevronDropdown__hidden)}>
                <button
                    type="button"
                    className={styles.chevronDropdown__toggleButton}
                    onClick={() => settAktiv(!aktiv)}
                >
                    <Element className={styles.chevronDropdown__toggleButton__text}>{text}</Element>
                    <Chevron type={type} />
                </button>
            </span>
            {aktiv && (
                <div className={classNames(styles.chevronDropdown__dropdown, className)}>
                    <span className={classNames(styles.chevronDropdown)}>
                        <button
                            type="button"
                            className={styles.chevronDropdown__toggleButton}
                            onClick={() => settAktiv(!aktiv)}
                        >
                            <Element className={styles.chevronDropdown__toggleButton__text}>{text}</Element>
                            <Chevron type={type} />
                        </button>
                        <div className={styles.chevronDropdown__dropdown__checkbox}>
                            <Checkbox label="Ikke klassifisert" />
                            <Checkbox label="Legeerklæring sykhus/spesialist." />
                            <Checkbox label="Andre med. oppl." />
                            <Checkbox label="Ikke med. oppl." />
                        </div>
                    </span>
                </div>
            )}
        </>
    );
}

export default ChevronDropdown;
