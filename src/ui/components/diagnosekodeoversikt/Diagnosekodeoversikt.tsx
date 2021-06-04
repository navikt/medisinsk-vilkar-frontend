import { get, post } from '@navikt/k9-http-utils';
import { Box, Margin, TitleWithUnderline, WarningIcon } from '@navikt/k9-react-components';
import axios from 'axios';
import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import React, { useMemo } from 'react';
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

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: () => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps) => {
    const { endpoints, httpErrorHandler } = React.useContext(ContainerContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [diagnosekodeResponse, setDiagnosekodeResponse] = React.useState<DiagnosekodeResponse>({
        diagnosekoder: [],
        links: [],
        behandlingUuid: '',
        versjon: null,
    });
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const { diagnosekoder, links } = diagnosekodeResponse;
    const endreDiagnosekoderLink = findLinkByRel(LinkRel.ENDRE_DIAGNOSEKODER, links);

    const hentDiagnosekoder = () => {
        setIsLoading(true);
        return get<DiagnosekodeResponse>(endpoints.diagnosekoder, httpErrorHandler, {
            cancelToken: httpCanceler.token,
        }).then((response: DiagnosekodeResponse) => {
            setDiagnosekodeResponse(response);
            setIsLoading(false);
        });
    };

    const slettDiagnosekode = (diagnosekode: Diagnosekode) => {
        return post(
            endreDiagnosekoderLink.href,
            {
                behandlingUuid: diagnosekodeResponse.behandlingUuid,
                versjon: diagnosekodeResponse.versjon,
                diagnosekoder: diagnosekoder.filter((kode) => kode !== diagnosekode),
            },
            httpErrorHandler
        )
            .then(hentDiagnosekoder)
            .then(onDiagnosekoderUpdated);
    };

    React.useEffect(() => {
        hentDiagnosekoder();
        return () => {
            httpCanceler.cancel();
        };
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

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
                            />
                        )}
                    />
                )}
            >
                Diagnosekoder
            </TitleWithUnderline>
            <Box marginTop={Margin.large}>
                {diagnosekoder.length === 0 && (
                    <IconWithText iconRenderer={() => <WarningIcon />} text="Ingen diagnosekode registrert." />
                )}
                {diagnosekoder.length >= 1 && (
                    <Diagnosekodeliste diagnosekoder={diagnosekoder} onDeleteClick={slettDiagnosekode} />
                )}
            </Box>
            <DiagnosekodeModal
                isOpen={modalIsOpen}
                onSaveClick={(nyDiagnosekode: Diagnosekode) =>
                    post(
                        endreDiagnosekoderLink.href,
                        {
                            behandlingUuid: diagnosekodeResponse.behandlingUuid,
                            versjon: diagnosekodeResponse.versjon,
                            diagnosekoder: [...diagnosekoder, nyDiagnosekode.kode],
                        },
                        httpErrorHandler,
                        { cancelToken: httpCanceler.token }
                    )
                        .then(hentDiagnosekoder)
                        .then(onDiagnosekoderUpdated)
                        .then(() => setModalIsOpen(false))
                }
                onRequestClose={() => setModalIsOpen(false)}
            />
        </div>
    );
};

export default Diagnosekodeoversikt;
