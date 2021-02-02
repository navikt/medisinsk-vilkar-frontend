import React from 'react';
import Modal from 'nav-frontend-modal';
import Alertstripe from 'nav-frontend-alertstriper';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';
import ConfirmationModal from '../confirmation-modal/ConfirmationModal';
import { prettifyPeriod } from '../../../util/formats';

interface OverlappendePeriodeModalProps {
    appElementId: string;
    perioderMedEndring: PeriodeMedEndring[];
    onConfirm: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const OverlappendePeriodeModal = ({
    appElementId,
    perioderMedEndring,
    onConfirm,
    onCancel,
    isOpen,
}: OverlappendePeriodeModalProps) => {
    Modal.setAppElement(`#${appElementId}`);
    return (
        <ConfirmationModal onConfirm={onConfirm} onCancel={onCancel} isOpen={isOpen}>
            {perioderMedEndring.map(({ periode }) => {
                return <Alertstripe type="advarsel">{prettifyPeriod(periode)}</Alertstripe>;
            })}
        </ConfirmationModal>
    );
};

export default OverlappendePeriodeModal;
