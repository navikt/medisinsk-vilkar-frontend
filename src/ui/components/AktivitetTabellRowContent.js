import React from 'react';
import AktivitetTabell from './AktivitetTabell';
import StatusIndicator from './StatusIndicator';
import Chevron from 'nav-frontend-chevron';

const AktivitetDataColumns = ({ aktivitet }) => {
    const { aktivitetsperiode, arbeidsgiverNavn, type, stillingsandel } = aktivitet;
    return (
        <>
            <AktivitetTabell.Column>
                <StatusIndicator aktivitet={aktivitet} />
            </AktivitetTabell.Column>
            <AktivitetTabell.Column>
                {aktivitetsperiode.fom}-{aktivitetsperiode.tom}
            </AktivitetTabell.Column>
            <AktivitetTabell.Column>{arbeidsgiverNavn}</AktivitetTabell.Column>
            <AktivitetTabell.Column>{type}</AktivitetTabell.Column>
            <AktivitetTabell.Column>{stillingsandel}%</AktivitetTabell.Column>
        </>
    );
};

const ClickableChevron = ({ onClick, direction }) => (
    <button
        onClick={onClick}
        role="button"
        style={{
            position: 'relative',
            border: 'none',
            background: 'none',
            outline: 'none',
        }}
        aria-label="Vurder aktivitet"
    >
        <Chevron
            onClick={onClick}
            type={direction}
            stor
            style={{
                color: '#0067C5',
                position: 'absolute',
                left: '-44px',
                top: '-4px',
            }}
        />
    </button>
);

export default ({ aktivitet, isActive, onClick }) => {
    const { måVurderesAvSaksbehandler } = aktivitet;
    const chevronDirection = isActive ? 'opp' : 'ned';
    return (
        <>
            <AktivitetDataColumns aktivitet={aktivitet} />
            {måVurderesAvSaksbehandler && (
                <ClickableChevron direction={chevronDirection} onClick={onClick} />
            )}
        </>
    );
};
