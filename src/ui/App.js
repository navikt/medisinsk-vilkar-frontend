import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import AktivitetTabell from './AktivitetTabell';
import AktivitetForm from './AktivitetForm';
import CheckCircle from './icons/CheckCircle';
import ExclamationCircle from './icons/ExclamationCircle';
import Chevron from 'nav-frontend-chevron';

function renderStatusColumn({ erAvslått, erGodkjent, måVurderesAvSaksbehandler }) {
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
}

function renderAktivitetColumns(aktivitet) {
    const { aktivitetsperiode, type, arbeidsgiverNavn, stillingsandel } = aktivitet;
    return (
        <>
            <AktivitetTabell.Column>{renderStatusColumn(aktivitet)}</AktivitetTabell.Column>
            <AktivitetTabell.Column>
                {aktivitetsperiode.fom}-{aktivitetsperiode.tom}
            </AktivitetTabell.Column>
            <AktivitetTabell.Column>{arbeidsgiverNavn}</AktivitetTabell.Column>
            <AktivitetTabell.Column>{type.kode}</AktivitetTabell.Column>
            <AktivitetTabell.Column>{stillingsandel}%</AktivitetTabell.Column>
        </>
    );
}

export default ({ opptjeninger, onSubmit }) => {
    const [activeRowIndex, setActiveRowIndex] = React.useState(-1);
    const [aktiviteter, updateAktiviteter] = React.useState(opptjeninger[0].aktiviteter);

    const updateActiveRowIndex = (clickedIndex) => {
        if (clickedIndex === activeRowIndex) {
            setActiveRowIndex(-1);
        } else {
            setActiveRowIndex(clickedIndex);
        }
    };

    const updateAktivitet = (formValues, aktivitetIndex) => {
        const { godkjenning } = formValues;
        const newAktiviteter = [...aktiviteter];
        newAktiviteter[aktivitetIndex].erGodkjent = godkjenning === 'godkjent';
        newAktiviteter[aktivitetIndex].erAvslått = godkjenning === 'ikkeGodkjent';
        updateAktiviteter([...newAktiviteter]);
        updateActiveRowIndex(-1);
    };

    const harAktiviteterSomMåVurderesAvSaksbehandler = ({ aktiviteter }) => {
        return aktiviteter.some(
            ({ måVurderesAvSaksbehandler }) => måVurderesAvSaksbehandler === true
        );
    };

    const formIsEditable = (opptjeninger) => {
        return opptjeninger.some(harAktiviteterSomMåVurderesAvSaksbehandler);
    };

    return (
        <div>
            <h3>Opptjeningsperioder</h3>
            <AktivitetTabell
                columnHeaders={['Status', 'Periode', 'Arbeidsgiver', 'Type', 'Stillingsandel']}
            >
                {aktiviteter.map((aktivitet, aktivitetIndex) => (
                    <AktivitetTabell.Row
                        isActive={aktivitetIndex === activeRowIndex}
                        renderWhenActive={() => (
                            <AktivitetForm
                                onSubmit={(event, formValues) => {
                                    event.preventDefault();
                                    updateAktivitet(formValues, aktivitetIndex);
                                }}
                                onCancel={() => {
                                    updateActiveRowIndex(-1);
                                }}
                            />
                        )}
                    >
                        {renderAktivitetColumns(aktivitet)}
                        {aktivitet.måVurderesAvSaksbehandler && (
                            <div>
                                <button
                                    onClick={() => updateActiveRowIndex(aktivitetIndex)}
                                    role="button"
                                    style={{
                                        position: 'relative',
                                        border: 'none',
                                        background: 'none',
                                        outline: 'none',
                                    }}
                                >
                                    <Chevron
                                        type={aktivitetIndex === activeRowIndex ? 'opp' : 'ned'}
                                        stor
                                        style={{
                                            color: '#0067C5',
                                            position: 'absolute',
                                            left: '-44px',
                                            top: '-4px',
                                        }}
                                    />
                                </button>
                            </div>
                        )}
                    </AktivitetTabell.Row>
                ))}
            </AktivitetTabell>
            {formIsEditable(opptjeninger) && (
                <Hovedknapp
                    style={{ marginTop: '10rem' }}
                    onClick={() => {
                        console.log('onSubmit', onSubmit({ aktiviteter: aktiviteter }));
                    }}
                >
                    Bekreft og fortsett
                </Hovedknapp>
            )}
        </div>
    );
};
