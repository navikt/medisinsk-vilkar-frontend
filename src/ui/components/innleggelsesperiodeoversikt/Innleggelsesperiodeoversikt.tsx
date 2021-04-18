import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import { Element } from 'nav-frontend-typografi';
import axios from 'axios';
import React, { useEffect, useMemo } from 'react';
import { Period } from '../../../types/Period';
import { get } from '../../../util/httpUtils';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Innleggelsesperiodeliste from '../innleggelsesperiodeliste/Innleggelsesperiodeliste';
import PageError from '../page-error/PageError';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import styles from './innleggelsesperiodeoversikt.less';
import InnleggelsesperiodeFormModal from '../innleggelsesperiodeFormModal/InnleggelsesperiodeFormModal';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import { InnleggelsesperiodeResponse } from '../../../types/InnleggelsesperiodeResponse';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';
import { postInnleggelsesperioder, postInnleggelsesperioderDryRun } from '../../../api/api';
import LinkButton from '../link-button/LinkButton';

export enum FieldName {
    INNLEGGELSESPERIODER = 'innleggelsesperioder',
}

interface InnleggelsesperiodeoversiktProps {
    onInnleggelsesperioderUpdated: () => void;
}

Modal.setAppElement('#app');
const Innleggelsesperiodeoversikt = ({
    onInnleggelsesperioderUpdated,
}: InnleggelsesperiodeoversiktProps): JSX.Element => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);

    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [innleggelsesperioderResponse, setInnleggelsesperioderResponse] = React.useState<InnleggelsesperiodeResponse>(
        { perioder: [], links: [], versjon: null, behandlingUuid: '' }
    );
    const [isLoading, setIsLoading] = React.useState(true);
    const [hentInnleggelsesperioderFeilet, setHentInnleggelsesperioderFeilet] = React.useState(false);
    const [lagreInnleggelsesperioderFeilet, setLagreInnleggelsesperioderFeilet] = React.useState(false);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const innleggelsesperioder = innleggelsesperioderResponse.perioder;
    const innleggelsesperioderDefault = innleggelsesperioder?.length > 0 ? innleggelsesperioder : [new Period('', '')];

    const hentInnleggelsesperioder = () => {
        return get(`${endpoints.innleggelsesperioder}`, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        });
    };

    const lagreInnleggelsesperioder = (formState) => {
        setIsLoading(true);
        let nyeInnleggelsesperioder = [];
        if (formState.innleggelsesperioder?.length > 0) {
            nyeInnleggelsesperioder = formState.innleggelsesperioder
                .filter((periodeWrapper) => periodeWrapper.period?.fom && periodeWrapper.period?.tom)
                .map((periodeWrapper) => new Period(periodeWrapper.period.fom, periodeWrapper.period.tom));
        }

        const { href } = findLinkByRel(LinkRel.ENDRE_INNLEGGELSESPERIODER, innleggelsesperioderResponse.links);
        const { behandlingUuid, versjon } = innleggelsesperioderResponse;
        postInnleggelsesperioder(
            href,
            { behandlingUuid, versjon, perioder: nyeInnleggelsesperioder },
            httpErrorHandler,
            httpCanceler.token
        )
            .then(onInnleggelsesperioderUpdated)
            .catch((error) => {
                console.error(error);
                setLagreInnleggelsesperioderFeilet(true);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        let isMounted = true;
        hentInnleggelsesperioder()
            .then((response: InnleggelsesperiodeResponse) => {
                if (isMounted) {
                    setInnleggelsesperioderResponse(response);
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
            <TitleWithUnderline
                contentAfterTitleRenderer={() => (
                    <WriteAccessBoundContent
                        otherRequirementsAreMet={innleggelsesperioder.length > 0}
                        contentRenderer={() => (
                            <LinkButton
                                className={styles.innleggelsesperiodeoversikt__redigerListeKnapp}
                                onClick={() => setModalIsOpen(true)}
                            >
                                Rediger liste
                            </LinkButton>
                        )}
                    />
                )}
            >
                Innleggelsesperioder
            </TitleWithUnderline>
            {isLoading ? (
                <Spinner />
            ) : (
                <>
                    <Box marginTop={Margin.large}>
                        {innleggelsesperioder.length === 0 && <p>Ingen innleggelsesperioder registrert</p>}
                        {innleggelsesperioder.length > 0 && (
                            <>
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
                                <AddButton
                                    label="Legg til periode"
                                    onClick={() => setModalIsOpen(true)}
                                    id="leggTilPeriodeKnapp"
                                />
                            </Box>
                        )}
                    />
                </>
            )}
            {modalIsOpen && (
                <InnleggelsesperiodeFormModal
                    defaultValues={{
                        [FieldName.INNLEGGELSESPERIODER]: innleggelsesperioderDefault,
                    }}
                    setModalIsOpen={setModalIsOpen}
                    onSubmit={lagreInnleggelsesperioder}
                    isLoading={isLoading}
                    endringerPåvirkerAndreBehandlinger={(nyeInnleggelsesperioder) => {
                        const { href, requestPayload } = findLinkByRel(
                            LinkRel.ENDRE_INNLEGGELSESPERIODER,
                            innleggelsesperioderResponse.links
                        );
                        return postInnleggelsesperioderDryRun(
                            href,
                            { ...requestPayload, perioder: nyeInnleggelsesperioder },
                            httpErrorHandler,
                            httpCanceler.token
                        );
                    }}
                />
            )}
        </div>
    );
};

export default Innleggelsesperiodeoversikt;
