import { Loader, Modal } from '@navikt/ds-react';
import { Box, Margin, TitleWithUnderline, WarningIcon } from '@navikt/ft-plattform-komponenter';
import { get, post } from '@navikt/k9-http-utils';
import React, { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
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

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: () => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps): JSX.Element => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const addButtonRef = React.useRef<HTMLButtonElement>();

    useEffect(() => {
        Modal.setAppElement(document.body);
    }, []);

    const hentDiagnosekoder = () =>
        get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler).then(
            (response: DiagnosekodeResponse) => response
        );

    const { isLoading, data, refetch } = useQuery('diagnosekodeResponse', hentDiagnosekoder);

    const { diagnosekoder, links, behandlingUuid, versjon } = data;
    const endreDiagnosekoderLink = findLinkByRel(LinkRel.ENDRE_DIAGNOSEKODER, links);

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

    const lagreDiagnosekode = (nyDiagnosekode: Diagnosekode) => {
        const nyeDiagnosekoder = [...diagnosekoder, nyDiagnosekode.kode];
        return post(
            endreDiagnosekoderLink.href,
            {
                behandlingUuid,
                versjon,
                diagnosekoder: [...new Set(nyeDiagnosekoder)],
            },
            httpErrorHandler
        );
    };

    const slettDiagnosekodeMutation = useMutation((diagnosekode: string) => slettDiagnosekode(diagnosekode), {
        onSuccess: () => {
            refetch().finally(() => {
                onDiagnosekoderUpdated();
                focusAddButton();
            });
        },
    });
    const lagreDiagnosekodeMutation = useMutation((diagnosekode: Diagnosekode) => lagreDiagnosekode(diagnosekode), {
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
                <Loader size="large" />
            ) : (
                <Box marginTop={Margin.large}>
                    {diagnosekoder.length === 0 && (
                        <IconWithText iconRenderer={() => <WarningIcon />} text="Ingen diagnosekode registrert." />
                    )}
                    {diagnosekoder.length >= 1 && (
                        <Diagnosekodeliste
                            diagnosekoder={diagnosekoder}
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
