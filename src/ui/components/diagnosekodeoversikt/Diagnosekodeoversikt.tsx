import React, { useMemo } from 'react';
import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import IconWithText from '../icon-with-text/IconWithText';
import WarningIcon from '../icons/WarningIcon';
import ContainerContext from '../../context/ContainerContext';
import { deleteData, fetchData, submitData } from '../../../util/httpUtils';
import Diagnosekode from '../../../types/Diagnosekode';
import DiagnosekodeModal from '../diagnosekode-modal/DiagnosekodeModal';

Modal.setAppElement('#app');

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: (diagnosekoder: Diagnosekode[]) => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps) => {
    const { endpoints } = React.useContext(ContainerContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [diagnosekoder, setDiagnosekoder] = React.useState<Diagnosekode[]>([]);

    const fetchAborter = useMemo(() => new AbortController(), []);

    React.useEffect(() => {
        return () => {
            fetchAborter.abort();
        };
    }, []);

    const hentDiagnosekoder = () => {
        setIsLoading(true);
        return fetchData(endpoints.diagnosekoder, { signal: fetchAborter.signal }).then(
            (newDiagnosekodeList: Diagnosekode[]) => {
                setDiagnosekoder(newDiagnosekodeList);
                onDiagnosekoderUpdated(newDiagnosekodeList);
                setIsLoading(false);
            }
        );
    };

    const slettDiagnosekode = (diagnosekode: Diagnosekode) => {
        return deleteData<Diagnosekode[]>(
            `${endpoints.slettDiagnosekode}?kode=${diagnosekode.kode}`,
            fetchAborter.signal
        ).then((newDiagnosekodeList) => {
            setDiagnosekoder(newDiagnosekodeList);
            onDiagnosekoderUpdated(newDiagnosekodeList);
        });
    };

    React.useEffect(() => {
        hentDiagnosekoder();
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
            <Box marginTop={Margin.large}>
                <AddButton label="Legg til diagnosekode" onClick={() => setModalIsOpen(true)} />
            </Box>
            <DiagnosekodeModal
                isOpen={modalIsOpen}
                onDiagnosekodeSaved={() => hentDiagnosekoder().then(() => setModalIsOpen(false))}
                onRequestClose={() => setModalIsOpen(false)}
            />
        </div>
    );
};

export default Diagnosekodeoversikt;
