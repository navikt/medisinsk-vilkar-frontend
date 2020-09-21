import React from 'react';
import Chevron from 'nav-frontend-chevron';
import AktivitetTabell from './AktivitetTabell';
import AktivitetForm from './AktivitetForm';
import CheckCircle from './icons/CheckCircle';
import ExclamationCircle from './icons/ExclamationCircle';

function renderAktivitetColumns(aktivitet) {
    const { klasse, aktivitetsperiode, type, arbeidsgiverNavn, stillingsandel } = aktivitet;
    return (
        <>
            <AktivitetTabell.Column>
                {klasse?.kode === 'Innvilget' && <CheckCircle />}
                {klasse?.kode === 'Må avklares' && <ExclamationCircle />}
                <span style={{ marginLeft: '1rem' }}>{klasse?.kode}</span>
            </AktivitetTabell.Column>
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
                            onCancel={() => {
                                updateActiveRowIndex(-1);
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
