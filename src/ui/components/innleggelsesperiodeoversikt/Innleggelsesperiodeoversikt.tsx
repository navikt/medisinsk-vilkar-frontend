import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React, { useEffect, useMemo } from 'react';
import { Period } from '../../../types/Period';
import { fetchData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';
import styles from './innleggelsesperiodeoversikt.less';
import NyInnleggelsesperiodeForm from './NyInnleggelsesperiodeForm';

export enum FieldName {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}
export interface Innleggelsesperiodeoversikt {
    [FieldName.INNLEGGELSESPERIODER]?: Period[];
}

Modal.setAppElement('#app');
const Innleggelsesperiodeoversikt = () => {
    const { endpoints } = React.useContext(ContainerContext);

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioder, setInnleggelsesperioder] = React.useState<Period[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const fetchAborter = useMemo(() => new AbortController(), []);

    const getInnleggelsesperioder = () => {
        const { signal } = fetchAborter;
        return fetchData(endpoints.innleggelsesperioder, { signal });
    };

    useEffect(() => {
        let isMounted = true;
        getInnleggelsesperioder()
            .then((nyeInnleggelsesperioder: Period[]) =>
                nyeInnleggelsesperioder.map(
                    (nyInnleggelsesperiode) => new Period(nyInnleggelsesperiode.fom, nyInnleggelsesperiode.tom)
                )
            )
            .then((nyeInnleggelsesperioder) => {
                if (isMounted) {
                    setInnleggelsesperioder(nyeInnleggelsesperioder);
                    setIsLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <div className={styles.innleggelsesperiodeoversikt__titleContainer}>
                <Undertittel>Innleggelsesperioder</Undertittel>
                {innleggelsesperioder.length > 0 && (
                    <button
                        type="button"
                        className={styles.innleggelsesperiodeoversikt__editButton}
                        onClick={() => setModalIsOpen(true)}
                    >
                        Rediger liste
                    </button>
                )}
            </div>
            <hr style={{ color: '#B7B1A9' }} />
            <Box marginTop={Margin.large}>
                {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
                {innleggelsesperioder.length > 0 && (
                    <>
                        <Element>Periode</Element>
                        <Box marginTop={Margin.small}>
                            <Innleggelsesperiodeliste innleggelsesperioder={innleggelsesperioder} />
                        </Box>
                    </>
                )}
            </Box>
            {innleggelsesperioder.length === 0 && (
                <Box marginTop={Margin.large}>
                    <AddButton label="Legg til innleggelsesperiode" onClick={() => setModalIsOpen(true)} />
                </Box>
            )}
            {modalIsOpen && (
                <NyInnleggelsesperiodeForm
                    defaultValues={{
                        [FieldName.INNLEGGELSESPERIODER]: innleggelsesperioder,
                    }}
                    setInnleggelsesperioder={setInnleggelsesperioder}
                    setModalIsOpen={setModalIsOpen}
                />
            )}
        </div>
    );
};

export default Innleggelsesperiodeoversikt;
