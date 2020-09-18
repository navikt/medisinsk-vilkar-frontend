import React from 'react';
import AktivitetTabell from './AktivitetTabell';
import AktivitetForm from './AktivitetForm';

function renderAktivitetColumns(aktivitet) {
    const { klasse, aktivitetsperiode, type, arbeidsgiverNavn, stillingsandel } = aktivitet;
    return (
        <>
            <AktivitetTabell.Column>{klasse?.kode}</AktivitetTabell.Column>
            <AktivitetTabell.Column>
                {aktivitetsperiode.fom}-{aktivitetsperiode.tom}
            </AktivitetTabell.Column>
            <AktivitetTabell.Column>{arbeidsgiverNavn}</AktivitetTabell.Column>
            <AktivitetTabell.Column>{type.kode}</AktivitetTabell.Column>
            <AktivitetTabell.Column>{stillingsandel}%</AktivitetTabell.Column>
        </>
    );
}

export default (opptjeningerFromApi) => {
    const [activeRowIndex, setActiveRowIndex] = React.useState(-1);
    const [aktiviteter, updateAktiviteter] = React.useState(
        opptjeningerFromApi.opptjeninger[0].aktiviteter
    );

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
        newAktiviteter[aktivitetIndex].klasse = {
            kode: godkjenning === 'godkjent' ? 'Innvilget' : 'Avslått',
        };
        updateAktiviteter([...newAktiviteter]);
        updateActiveRowIndex(-1);
    };

    return (
        <AktivitetTabell
            columnHeaders={['Status', 'Periode', 'Arbeidsgiver', 'Type', 'Stillingsandel']}
            onFormSubmission={(formValues) => {
                console.log(formValues);
            }}
        >
            {aktiviteter.map((aktivitet, aktivitetIndex) => (
                <AktivitetTabell.Row
                    isActive={aktivitetIndex === activeRowIndex}
                    onButtonClick={() => updateActiveRowIndex(aktivitetIndex)}
                    renderWhenActive={() => (
                        <AktivitetForm
                            onSubmit={(event, formValues) => {
                                event.preventDefault();
                                updateAktivitet(formValues, aktivitetIndex);
                            }}
                        />
                    )}
                >
                    {renderAktivitetColumns(aktivitet)}
                </AktivitetTabell.Row>
            ))}
        </AktivitetTabell>
    );
};
