import React, { useState } from 'react';
import { Element } from 'nav-frontend-typografi';
import Chevron from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import classNames from 'classnames';
import { FilterFilled } from '@navikt/ds-icons';
import { Dokumenttype, dokumentLabel } from '../../../types/Dokument';
import styles from './chevronDropdown.less';

interface ChevronDropdownProps {
    text: string;
    className: string;
    dokumenttypeFilter: Array<Dokumenttype>;
    setDokumenttypeFilter: (value: Array<Dokumenttype>) => void;
}

function ChevronDropdown({
    text,
    className,
    dokumenttypeFilter,
    setDokumenttypeFilter,
}: ChevronDropdownProps): JSX.Element {
    const [aktiv, settAktiv] = useState(false);
    const chevronType = aktiv ? 'opp' : 'ned';
    const dokumenttypeListe = [...Object.values(Dokumenttype)];
    const listeErFiltrert = dokumenttypeFilter.length < 4;
    return (
        <>
            <span className={classNames(styles.chevronDropdown, className, aktiv && styles.chevronDropdown__hidden)}>
                <button
                    type="button"
                    className={styles.chevronDropdown__toggleButton}
                    onClick={() => settAktiv(!aktiv)}
                >
                    <Element className={styles.chevronDropdown__toggleButton__text}>{text}</Element>
                    <Chevron type={chevronType} />
                </button>
                <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
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
                            <Chevron type={chevronType} />
                        </button>
                        <FilterFilled className={listeErFiltrert ? '' : styles.chevronDropdown__hidden} />
                        <div className={styles.chevronDropdown__dropdown__checkbox}>
                            {dokumenttypeListe.map((type) => (
                                <Checkbox
                                    key={type}
                                    label={dokumentLabel[type]}
                                    checked={dokumenttypeFilter.includes(type)}
                                    onChange={() =>
                                        dokumenttypeFilter.includes(type)
                                            ? setDokumenttypeFilter(dokumenttypeFilter.filter((v) => v !== type))
                                            : setDokumenttypeFilter(dokumenttypeFilter.concat([type]))
                                    }
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
