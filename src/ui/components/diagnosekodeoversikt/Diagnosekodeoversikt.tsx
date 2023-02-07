import { Box, Margin, TitleWithUnderline, WarningIcon } from '@navikt/ft-plattform-komponenter';
import { get, post } from '@navikt/k9-http-utils';
import axios from 'axios';
import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import React, { useMemo } from 'react';
import { useMutation, useQueries, useQuery } from 'react-query';
import LinkRel from '../../../constants/LinkRel';
import Diagnosekode from '../../../types/Diagnosekode';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import { findLinkByRel } from '../../../util/linkUtils';
import ContainerContext from '../../context/ContainerContext';
import AddButton from '../add-button/AddButton';
import DiagnosekodeModal from '../diagnosekode-modal/DiagnosekodeModal';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';
import IconWithText from '../icon-with-text/IconWithText';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';

Modal.setAppElement('#app');

const fetchDiagnosekoderByQuery = (queryString: string): Promise<Diagnosekode> =>
    axios
        .get(`/k9/diagnosekoder/?query=${queryString}&max=8`)
        .then((response) => (response.data && response.data.length === 1 ? response.data[0] : { kode: queryString }));

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: () => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps): JSX.Element => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const addButtonRef = React.useRef<HTMLButtonElement>();

    const hentDiagnosekoder = () =>
        get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler).then(
            (response: DiagnosekodeResponse) => response
        );

    const { isLoading, data, refetch } = useQuery('diagnosekodeResponse', hentDiagnosekoder);

    const { diagnosekoder, links, behandlingUuid, versjon } = data;
    const endreDiagnosekoderLink = findLinkByRel(LinkRel.ENDRE_DIAGNOSEKODER, links);

    const diagnosekoderMedNavnResponses = useQueries(
        diagnosekoder.map((diagnosekode) => ({
            queryKey: ['diagnosekode', diagnosekode],
            queryFn: () => fetchDiagnosekoderByQuery(diagnosekode),
            refetchOnWindowFocus: false,
        }))
    );

    const diagnosekoderMedNavn = useMemo(
        () => diagnosekoderMedNavnResponses.filter((response) => !!response.data).map((response) => response.data),
        [diagnosekoderMedNavnResponses]
    );

    const focusAddButton = () => {
        if (addButtonRef.current) {
            addButtonRef.current.focus();
        }
    };

    const slettDiagnosekode = (diagnosekode: string) =>
        post(
            endreDiagnosekoderLink.href,
            {
                behandlingUuid,
                versjon,
                diagnosekoder: diagnosekoder.filter((kode) => kode !== diagnosekode),
            },
            httpErrorHandler
        );

    const lagreDiagnosekode = (nyeDiagnosekoder: string[]) =>
        post(
            endreDiagnosekoderLink.href,
            {
                behandlingUuid,
                versjon,
                diagnosekoder: [...new Set([...diagnosekoder, ...nyeDiagnosekoder])],
            },
            httpErrorHandler
        );

    const slettDiagnosekodeMutation = useMutation((diagnosekode: string) => slettDiagnosekode(diagnosekode), {
        onSuccess: () => {
            refetch().finally(() => {
                onDiagnosekoderUpdated();
                focusAddButton();
            });
        },
    });
    const lagreDiagnosekodeMutation = useMutation((nyeDiagnosekoder: string[]) => lagreDiagnosekode(nyeDiagnosekoder), {
        onSuccess: () => {
            refetch().finally(() => {
                onDiagnosekoderUpdated();
                setModalIsOpen(false);
                focusAddButton();
            });
        },
    });

    return (
        <div>
            <TitleWithUnderline
                contentAfterTitleRenderer={() => (
                    <WriteAccessBoundContent
                        contentRenderer={() => (
                            <AddButton
                                id="leggTilDiagnosekodeKnapp"
                                label="Ny diagnosekode"
                                onClick={() => setModalIsOpen(true)}
                                ariaLabel="Legg til diagnosekode"
                                ref={addButtonRef}
                            />
                        )}
                    />
                )}
            >
                Diagnosekoder
            </TitleWithUnderline>
            {isLoading ? (
                <Spinner />
            ) : (
                <Box marginTop={Margin.large}>
                    {diagnosekoder.length === 0 && (
                        <IconWithText iconRenderer={() => <WarningIcon />} text="Ingen diagnosekode registrert." />
                    )}
                    {diagnosekoder.length >= 1 && (
                        <Diagnosekodeliste
                            diagnosekoder={diagnosekoderMedNavn}
                            onDeleteClick={slettDiagnosekodeMutation.mutate}
                        />
                    )}
                </Box>
            )}
            <DiagnosekodeModal
                isOpen={modalIsOpen}
                onSaveClick={lagreDiagnosekodeMutation.mutateAsync}
                onRequestClose={() => setModalIsOpen(false)}
            />
        </div>
    );
};

export default Diagnosekodeoversikt;
