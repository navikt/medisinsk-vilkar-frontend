import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import { Element, Undertittel } from 'nav-frontend-typografi';
import React, { useEffect, useMemo } from 'react';
import { Period } from '../../../types/Period';
import { fetchData, submitData } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';
import PageError from '../page-error/PageError';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import styles from './innleggelsesperiodeoversikt.less';
import InnleggelsesperiodeFormModal from '../innleggelsesperiodeFormModal/InnleggelsesperiodeFormModal';

export enum FieldName {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}
export interface Innleggelsesperiodeoversikt {
    [FieldName.INNLEGGELSESPERIODER]?: Period[];
}

Modal.setAppElement('#app');
const Innleggelsesperiodeoversikt = (): JSX.Element => {
    const { endpoints } = React.useContext(ContainerContext);

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioder, setInnleggelsesperioder] = React.useState<Period[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hentInnleggelsesperioderFeilet, setHentInnleggelsesperioderFeilet] = React.useState(false);
    const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);
    const fetchAborter = useMemo(() => new AbortController(), []);

    const hentInnleggelsesperioder = () => {
        const { signal } = fetchAborter;
        return fetchData(endpoints.innleggelsesperioder, { signal });
    };

    const lagreInnleggelsesperioder = (formState) => {
        const { signal } = fetchAborter;
        setIsLoading(true);
        let perioder = [];
        if (formState.innleggelsesperioder?.length > 0) {
            perioder = formState.innleggelsesperioder
                .filter((periodeWrapper) => periodeWrapper.period?.fom && periodeWrapper.period?.tom)
                .map((periodeWrapper) => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom));
        }

        submitData(endpoints.lagreInnleggelsesperioder, perioder, signal)
            .then((nyeInnleggelsesperioder) => {
                setInnleggelsesperioder(nyeInnleggelsesperioder);
                setIsLoading(false);
                setModalIsOpen(false);
            })
            .catch((error) => {
                console.error(error);
                setLagreInnleggelsesperioderFeilet(true);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        let isMounted = true;
        hentInnleggelsesperioder()
            .then((nyeInnleggelsesperioder: Period[]) => {
                if (isMounted) {
                    setInnleggelsesperioder(nyeInnleggelsesperioder);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                console.error(error);
                setHentInnleggelsesperioderFeilet(true);
            });
        return () => {
            isMounted = false;
            fetchAborter.abort();
        };
    }, []);

    if (hentInnleggelsesperioderFeilet || lagreInnleggelsesperioderFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <TitleWithUnderline>
                Innleggelsesperioder
                {innleggelsesperioder.length > 0 && (
                    <button
                        type="button"
                        className={styles.innleggelsesperiodeoversikt__editButton}
                        onClick={() => setModalIsOpen(true)}
                    >
                        Rediger liste
                    </button>
                )}
            </TitleWithUnderline>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
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
                </>
            )}
            {modalIsOpen && (
                <InnleggelsesperiodeFormModal
                    defaultValues={{
                        [FieldName.INNLEGGELSESPERIODER]: innleggelsesperioder,
                    }}
                    setModalIsOpen={setModalIsOpen}
                    lagreInnleggelsesperioder={lagreInnleggelsesperioder}
                    isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default Innleggelsesperiodeoversikt;
