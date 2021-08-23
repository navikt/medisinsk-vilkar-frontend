import React, { useState } from 'react';
import { Element } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import classNames from 'classnames';
import { FilterFilled } from '@navikt/ds-icons';
import { Dokumenttype, dokumentLabel } from '../../../types/Dokument';
import styles from './chevronDropdown.less';

interface ChevronWithTextProps {
    chevronDirection: 'opp' | 'ned';
    onClick: () => void;
    text: string;
}
interface ChevronDropdownProps {
    text: string;
    className: string;
    dokumenttypeFilter: Array<Dokumenttype>;
    filtrerDokumenttype: (value: string) => void;
}

function ChevronWithText({ chevronDirection, onClick, text }: ChevronWithTextProps): JSX.Element {
    return (
        <button type="button" className={styles.chevronDropdown__toggleButton} onClick={onClick}>
            <Element className={styles.chevronDropdown__toggleButton__text}>{text}</Element>
            <Chevron type={chevronDirection} />
        </button>
    );
}

function ChevronDropdown({
    text,
    className,
    dokumenttypeFilter,
    filtrerDokumenttype,
}: ChevronDropdownProps): JSX.Element {
    const [open, setOpen] = useState(false);
    const chevronDirection = open ? 'opp' : 'ned';
    const dokumenttypeListe = [...Object.values(Dokumenttype)];
    const listeErFiltrert = dokumenttypeFilter.length < 4;
    return (
        <>
            <span className={classNames(styles.chevronDropdown, className, open && styles.chevronDropdown__hidden)}>
                <ChevronWithText chevronDirection={chevronDirection} onClick={() => setOpen(!open)} text={text} />
                <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
            </span>
            {open && (
                <div className={classNames(styles.chevronDropdown__dropdown, className)}>
                    <span className={classNames(styles.chevronDropdown)}>
                        <ChevronWithText
                            chevronDirection={chevronDirection}
                            onClick={() => setOpen(!open)}
                            text={text}
                        />
                        <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
                        <div className={styles.chevronDropdown__dropdown__checkbox}>
                            {dokumenttypeListe.map((type) => (
                                <Checkbox
                                    key={type}
                                    label={dokumentLabel[type]}
                                    checked={dokumenttypeFilter.includes(type)}
                                    onChange={() => filtrerDokumenttype(type)}
                                />
                            ))}
                        </div>
                    </span>
                </div>
            )}
        </>
    );
}

export default ChevronDropdown;
