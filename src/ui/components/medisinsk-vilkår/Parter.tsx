import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import mockedParter from '../../../mock/mockedParter';
import TwoPersonsWithOneHighlightedIcon from '../icons/TwoPersonsWithOneHighlightedIcon';
import styles from './parter.less';

interface ParterProps {
    scenario: number;
}

const Parter = ({ scenario }: ParterProps): JSX.Element => {
    const parter = mockedParter[scenario]?.parter;

    return (
        <AlertStripe type="info">
            <div className={styles.parter__content}>
                <p className={styles.parter__text}>Sykdomsvurderingen ligger på barnet og er felles</p>
                <div className={styles.parter__textContainer}>
                    <div className={styles.parter__icon}>
                        <TwoPersonsWithOneHighlightedIcon />
                    </div>
                    <p className={styles.parter__text}>{`Parter i saken: ${parter?.join(', ')}`}</p>
                </div>
            </div>
        </AlertStripe>
    );
};
export default Parter;
