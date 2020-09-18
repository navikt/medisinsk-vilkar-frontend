import React from 'react';
import { render } from 'react-dom';
import App from './App';
const loadingMessageCls = 'loadingMessage';

function renderErrorMessage() {
    /*    const h3 = document.createElement('h3');
        const text = document.createTextNode('Noe gikk galt :(');
        h3.append(text);
        appendToOpptjeningApp(h3);*/
}

function renderAppInLoadingState() {
    /*
        const h3 = document.createElement('h3');
        const text = document.createTextNode('Vennligst vent, siden laster...');
        h3.classList.add(loadingMessageCls);
        h3.append(text);
        appendToOpptjeningApp(h3);
     */
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
