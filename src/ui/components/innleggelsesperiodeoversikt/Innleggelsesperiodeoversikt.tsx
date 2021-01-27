import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import { Element } from 'nav-frontend-typografi';
import axios from 'axios';
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
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';

export enum FieldName {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}

Modal.setAppElement('#app');
const Innleggelsesperiodeoversikt = (): JSX.Element => {
    const { endpoints } = React.useContext(ContainerContext);

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioder, setInnleggelsesperioder] = React.useState<Period[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hentInnleggelsesperioderFeilet, setHentInnleggelsesperioderFeilet] = React.useState(false);
    const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const hentInnleggelsesperioder = () => {
        return fetchData(endpoints.innleggelsesperioder, { cancelToken: httpCanceler.token });
    };

    const lagreInnleggelsesperioder = (formState) => {
        setIsLoading(true);
        let perioder = [];
        if (formState.innleggelsesperioder?.length > 0) {
            perioder = formState.innleggelsesperioder
                .filter((periodeWrapper) => periodeWrapper.period?.fom && periodeWrapper.period?.tom)
                .map((periodeWrapper) => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom));
        }

        submitData(endpoints.lagreInnleggelsesperioder, perioder, { cancelToken: httpCanceler.token })
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
            httpCanceler.cancel();
        };
    }, []);

    if (hentInnleggelsesperioderFeilet || lagreInnleggelsesperioderFeilet) {
        return <PageError message="Noe gikk galt, vennligst prøv igjen senere" />;
    }

    return (
        <div className={styles.innleggelsesperiodeoversikt}>
            <TitleWithUnderline>
                Innleggelsesperioder
                <WriteAccessBoundContent
                    otherRequirementsAreMet={innleggelsesperioder.length > 0}
                    contentRenderer={() => (
                        <button
                            type="button"
                            className={styles.innleggelsesperiodeoversikt__editButton}
                            onClick={() => setModalIsOpen(true)}
                        >
                            Rediger liste
                        </button>
                    )}
                />
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
                    <WriteAccessBoundContent
                        otherRequirementsAreMet={innleggelsesperioder.length === 0}
                        contentRenderer={() => (
                            <Box marginTop={Margin.large}>
                                <AddButton label="Legg til innleggelsesperiode" onClick={() => setModalIsOpen(true)} />
                            </Box>
                        )}
                    />
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
