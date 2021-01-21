import React, { useMemo } from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';
import Spinner from 'nav-frontend-spinner';
import DiagnosekodeSelector from '../../form/pure/PureDiagnosekodeSelector';
import AddButton from '../add-button/AddButton';
import Box, { Margin } from '../box/Box';
import Diagnosekodeliste from '../diagnosekodeliste/Diagnosekodeliste';
import ModalFormWrapper from '../modal-form-wrapper/ModalFormWrapper';
import TitleWithUnderline from '../title-with-underline/TitleWithUnderline';
import IconWithText from '../icon-with-text/IconWithText';
import WarningIcon from '../icons/WarningIcon';
import ContainerContext from '../../context/ContainerContext';
import { deleteData, fetchData, submitData } from '../../../util/httpUtils';
import Diagnosekode from '../../../types/Diagnosekode';
import styles from './diagnosekodeoversikt.less';

Modal.setAppElement('#app');

interface DiagnosekodeoversiktProps {
    onDiagnosekoderUpdated: (diagnosekoder: Diagnosekode[]) => void;
}

const Diagnosekodeoversikt = ({ onDiagnosekoderUpdated }: DiagnosekodeoversiktProps) => {
    const { endpoints } = React.useContext(ContainerContext);
    const [isLoading, setIsLoading] = React.useState(true);
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [diagnosekoder, setDiagnosekoder] = React.useState<Diagnosekode[]>([]);
    const [nyDiagnosekode, setNyDiagnosekode] = React.useState<string>('');

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

    const lagreDiagnosekode = () => {
        return submitData(
            endpoints.leggTilDiagnosekode,
            { kode: 'mock', beskrivelse: nyDiagnosekode },
            fetchAborter.signal
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
            <Modal
                isOpen={modalIsOpen}
                closeButton
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
                contentLabel="Legg til diagnosekode"
                className={styles.diagnosekodeoversikt__modal}
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        lagreDiagnosekode()
                            .then(() => setModalIsOpen(false))
                            .then(hentDiagnosekoder);
                    }}
                >
                    <ModalFormWrapper title="Legg til diagnosekode">
                        <Box marginTop={Margin.large}>
                            <DiagnosekodeSelector
                                initialDiagnosekodeValue=""
                                name="diagnosekode"
                                onChange={(value) => setNyDiagnosekode(value)}
                                label="Diagnosekode"
                                hideLabel
                            />
                        </Box>
                        <Box marginTop={Margin.xLarge}>
                            <div style={{ display: 'flex' }}>
                                <Hovedknapp mini>Lagre</Hovedknapp>
                                <Knapp
                                    mini
                                    style={{ marginLeft: '1rem' }}
                                    htmlType="button"
                                    onClick={() => setModalIsOpen(false)}
                                >
                                    Avbryt
                                </Knapp>
                            </div>
                        </Box>
                    </ModalFormWrapper>
                </form>
            </Modal>
        </div>
    );
};

export default Diagnosekodeoversikt;
