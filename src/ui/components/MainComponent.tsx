import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import Legeerklæring from './Legeerklæring';
import styles from './medisinskVilkar.less';

const MainComponent = () => {
    return (
        <>
            <form onSubmit={() => null}>
                <div className={styles.headingContainer}>
                    <Systemtittel>Fakta</Systemtittel>
                </div>
                <div className={styles.fieldContainerLarge}>
                    <Legeerklæring readOnly={false} />
                </div>
            </form>
        </>
    );
};

export default MainComponent;
