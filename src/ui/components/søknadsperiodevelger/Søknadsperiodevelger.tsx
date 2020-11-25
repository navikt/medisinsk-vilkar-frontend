import React from 'react';
import { Period } from '../../../types/Period';
import { prettifyPeriod } from '../../../util/formats';
import { Søknadsperiode } from '../../../types/medisinsk-vilkår/sykdom';
import styles from './søknadsperiodvelger.less';

interface SøknadsperiodevelgerProps {
    søknadsperioder: Søknadsperiode[];
    onSøknadsperiodeClick: (valgtPeriode: Søknadsperiode) => void;
}

const Søknadsperiodevelger = ({ søknadsperioder, onSøknadsperiodeClick }: SøknadsperiodevelgerProps) => {
    return (
        <div className={styles.søknadsperiodevelger}>
            {søknadsperioder.map((periode, i) => {
                const { fom, tom } = periode;
                return (
                    <div
                        className={styles.søknadsperiodevelger__item}
                        onClick={() => onSøknadsperiodeClick(periode)}
                        key={i + ''}
                    >
                        {prettifyPeriod(new Period(fom, tom))}
                    </div>
                );
            })}
        </div>
    );
};

export default Søknadsperiodevelger;
