import React, { useMemo } from 'react';
import axios from 'axios';
import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import IconWithText from '../icon-with-text/IconWithText';
import WarningIcon from '../icons/WarningIcon';
import ContainerContext from '../../context/ContainerContext';
import { get, post } from '../../../util/httpUtils';
import Diagnosekode from '../../../types/Diagnosekode';
import DiagnosekodeModal from '../diagnosekode-modal/DiagnosekodeModal';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';
import { findLinkByRel } from '../../../util/linkUtils';
import LinkRel from '../../../constants/LinkRel';

Modal.setAppElement('#app');

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: (diagnosekoder: Diagnosekode[]) => void;
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
            onDiagnosekoderUpdated(response.diagnosekoder);
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
        ).then(hentDiagnosekoder);
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
            <TitleWithUnderline>Diagnosekoder</TitleWithUnderline>
            <Box marginTop={Margin.large}>
                {diagnosekoder.length === 0 && (
                    <IconWithText iconRenderer={() => <WarningIcon />} text="Ingen diagnosekode registrert." />
                )}
                {diagnosekoder.length >= 1 && (
                    <Diagnosekodeliste diagnosekoder={diagnosekoder} onDeleteClick={slettDiagnosekode} />
                )}
            </Box>
            <WriteAccessBoundContent
                contentRenderer={() => (
                    <Box marginTop={Margin.large}>
                        <AddButton
                            id="leggTilDiagnosekodeKnapp"
                            label="Legg til diagnosekode"
                            onClick={() => setModalIsOpen(true)}
                        />
                    </Box>
                )}
            />
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
                        .then(() => setModalIsOpen(false))
                }
                onRequestClose={() => setModalIsOpen(false)}
            />
        </div>
    );
};

export default Diagnosekodeoversikt;
