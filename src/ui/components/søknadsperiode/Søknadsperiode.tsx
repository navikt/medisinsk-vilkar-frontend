import React from 'react';
import { Element } from 'nav-frontend-typografi';
import CalendarIcon from '../icons/CalendarIcon';
import { prettifyPeriod } from '../../../util/formats';
import SøknadsperiodeContext from '../../context/SøknadsperiodeContext';
import styles from './søknadsperiode.less';

const Søknadsperiode = () => (
    <SøknadsperiodeContext.Consumer>
        {(søknadsperiode) => (
            <div className={styles.søknadperiodeContainer}>
                <CalendarIcon />
                <p className={styles.søknadperiodeInfo}>
                    {`Søknadsperiode: `}
                    <Element tag="span">{prettifyPeriod(søknadsperiode)}</Element>
                </p>
            </div>
        )}
    </SøknadsperiodeContext.Consumer>
);

export default Søknadsperiode;
