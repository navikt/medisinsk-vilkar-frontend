import React from 'react';
import CheckCircle from '../icons/CheckCircle';
import ExclamationCircle from '../icons/ExclamationCircle';

export default ({ aktivitet: { erAvslått, erGodkjent, måVurderesAvSaksbehandler } }) => {
    if (erGodkjent) {
        return [
            <CheckCircle key="icon" />,
            <span key="text" style={{ marginLeft: '1rem' }}>
                Godkjent
            </span>,
        ];
    }
    if (erAvslått) {
        return [
            <CheckCircle key="icon" />,
            <span key="text" style={{ marginLeft: '1rem' }}>
                Avslått
            </span>,
        ];
    }
    if (måVurderesAvSaksbehandler) {
        return [
            <ExclamationCircle key="icon" />,
            <span key="text" style={{ marginLeft: '1rem' }}>
                Må vurderes
            </span>,
        ];
    }
    return null;
};
