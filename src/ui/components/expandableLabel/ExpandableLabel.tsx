import * as React from 'react';
import ChevronIcon from '../icons/ChevronIcon';
import styles from './expandableLabel.less';

interface HelptextProps {
    labelText: React.ReactNode;
    helptext: string;
    labelFor: string;
}

const ExpandableLabel = ({ helptext, labelText, labelFor }: HelptextProps): JSX.Element => {
    const [open, setOpen] = React.useState(false);
    return (
        <div className={styles.expandableLabel}>
            <label htmlFor={labelFor}>
                {labelText}
                <p className={open ? '' : styles.visuallyHidden}>{helptext}</p>
            </label>

            <button
                className={styles.expandableLabel__button}
                type="button"
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                {open ? 'Lukk hjelpetekst' : 'Mer hjelpetekst'}
                <span
                    className={
                        open
                            ? `${styles.expandableLabel__chevron} ${styles['expandableLabel__chevron--open']}`
                            : styles.expandableLabel__chevron
                    }
                >
                    <ChevronIcon />
                </span>
            </button>
        </div>
    );
};

export default ExpandableLabel;
