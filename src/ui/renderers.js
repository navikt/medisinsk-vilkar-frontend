import React from 'react';
import { render } from 'react-dom';
import App from './App';

function renderErrorMessage() {
    return <p>Noe gikk galt :(</p>;
}

function renderAppInLoadingState() {
    return <p>Laster</p>;
}

function renderAppInSuccessfulState(appId, opptjeningData, aksjonspunktService) {
    const opptjeninger = opptjeningData.opptjeninger;
    render(<App opptjeninger={opptjeninger} />, document.getElementById(appId));
}

export default {
    renderAppInSuccessfulState,
    renderAppInLoadingState,
    renderErrorMessage,
};
