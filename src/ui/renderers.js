import React from 'react';
import { render } from 'react-dom';
import MainComponent from './components/MainComponent';

function renderErrorMessage() {
    return <p>Noe gikk galt :(</p>;
}

function renderAppInLoadingState() {
    return <p>Laster</p>;
}

function renderAppInSuccessfulState(appId, opptjeningData, onSubmit) {
    const opptjeninger = opptjeningData.opptjeninger;
    render(
        <MainComponent initialOpptjeninger={opptjeninger} onSubmit={onSubmit} />,
        document.getElementById(appId)
    );
}

export default {
    renderAppInSuccessfulState,
    renderAppInLoadingState,
    renderErrorMessage,
};
