import React from 'react';
import AktivitetTabell from './AktivitetTabell';
import AktivitetForm from './AktivitetForm';
import AktivitetTabellRowContent from './AktivitetTabellRowContent';

export default ({ opptjening: { aktiviteter }, onAktiviteterUpdated }) => {
    const [activeRowIndex, setActiveRowIndex] = React.useState(-1);

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
        onAktiviteterUpdated(newAktiviteter);
        updateActiveRowIndex(-1);
    };

    const onAktivitetClick = ({ måVurderesAvSaksbehandler }, aktivitetIndex) => {
        if (måVurderesAvSaksbehandler) {
            updateActiveRowIndex(aktivitetIndex);
        }
    };

    const renderAktivitetRow = (aktivitet, aktivitetIndex) => (
        <AktivitetTabell.Row
            isActive={aktivitetIndex === activeRowIndex}
            onClick={() => onAktivitetClick(aktivitet, aktivitetIndex)}
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
            <AktivitetTabellRowContent
                aktivitet={aktivitet}
                isActive={activeRowIndex === aktivitetIndex}
                onClick={() => onAktivitetClick(aktivitet, aktivitetIndex)}
            />
        </AktivitetTabell.Row>
    );

    return (
        <AktivitetTabell
            columnHeaders={['Status', 'Periode', 'Arbeidsgiver', 'Type', 'Stillingsandel']}
        >
            {aktiviteter.map(renderAktivitetRow)}
        </AktivitetTabell>
    );
};
