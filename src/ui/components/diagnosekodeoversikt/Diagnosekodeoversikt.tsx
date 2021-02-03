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
import { deleteData, fetchData } from '../../../util/httpUtils';
import Diagnosekode from '../../../types/Diagnosekode';
import DiagnosekodeModal from '../diagnosekode-modal/DiagnosekodeModal';
import WriteAccessBoundContent from '../write-access-bound-content/WriteAccessBoundContent';
import { DiagnosekodeResponse } from '../../../types/DiagnosekodeResponse';

Modal.setAppElement('#app');

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: (diagnosekoder: Diagnosekode[]) => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps) => {
    const { endpoints, behandlingUuid } = React.useContext(ContainerContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [diagnosekoder, setDiagnosekoder] = React.useState<Diagnosekode[]>([]);
    const httpCanceler = useMemo(() => axios.CancelToken.source(), []);

    const hentDiagnosekoder = () => {
        setIsLoading(true);
        return fetchData<DiagnosekodeResponse>(`${endpoints.diagnosekoder}?behandlingUuid=${behandlingUuid}`, {
            cancelToken: httpCanceler.token,
        }).then((diagnosekodeResponse: DiagnosekodeResponse) => {
            setDiagnosekoder(diagnosekodeResponse.diagnosekoder);
            onDiagnosekoderUpdated(diagnosekodeResponse.diagnosekoder);
            setIsLoading(false);
        });
    };

    const slettDiagnosekode = (diagnosekode: Diagnosekode) => {
        return deleteData<Diagnosekode[]>(`${endpoints.slettDiagnosekode}?kode=${diagnosekode.kode}`, {
            cancelToken: httpCanceler.token,
        }).then((newDiagnosekodeList) => {
            setDiagnosekoder(newDiagnosekodeList);
            onDiagnosekoderUpdated(newDiagnosekodeList);
        });
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
                    <Diagnosekodeliste
                        diagnosekoder={diagnosekoder}
                        onDeleteClick={(diagnosekodeToDelete) => slettDiagnosekode(diagnosekodeToDelete)}
                    />
                )}
            </Box>
            <WriteAccessBoundContent
                contentRenderer={() => (
                    <Box marginTop={Margin.large}>
                        <AddButton label="Legg til diagnosekode" onClick={() => setModalIsOpen(true)} />
                    </Box>
                )}
            />
            <DiagnosekodeModal
                isOpen={modalIsOpen}
                onDiagnosekodeSaved={() => hentDiagnosekoder().then(() => setModalIsOpen(false))}
                onRequestClose={() => setModalIsOpen(false)}
            />
        </div>
    );
};

export default Diagnosekodeoversikt;
