import React from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import utils from '../../util/utils';
import OpptjeningsperiodeContent from './OpptjeningsperiodeContent';

const MainComponent = ({ initialOpptjeninger, onSubmit }) => {
    const [opptjeninger, updateOpptjeninger] = React.useState(initialOpptjeninger);

    const formIsEditable = (opptjeninger) => {
        return utils.opptjeningerHarAktiviteterSomMåVurderesAvSaksbehandler(opptjeninger);
    };

    const updateOpptjening = (updatedOpptjening, opptjeningIndex) => {
        const newOpptjeninger = [...opptjeninger];
        newOpptjeninger[opptjeningIndex] = updatedOpptjening;
        updateOpptjeninger(newOpptjeninger);
    };

    const renderOpptjeningPresentation = (opptjening, opptjeningIndex) => (
        <OpptjeningsperiodeContent
            opptjening={opptjening}
            onAktiviteterUpdated={(aktiviteter) => {
                opptjening.aktiviteter = aktiviteter;
                updateOpptjening(opptjening, opptjeningIndex);
            }}
        />
    );

    return (
        <div>
            <h3>Opptjeningsperioder</h3>
            {opptjeninger.map(renderOpptjeningPresentation)}
            {formIsEditable(opptjeninger) && (
                <Hovedknapp
                    style={{ marginTop: '10rem' }}
                    onClick={() => {
                        onSubmit({ opptjeninger });
                    }}
                >
                    Bekreft og fortsett
                </Hovedknapp>
            )}
        </div>
    );
};

export default MainComponent;
