import { appendToOpptjeningApp, renderOpptjeningTable } from "../renderUtils";
import { toggleElementByCls } from "./utils";

const loadingMessageCls = 'loadingMessage';

function renderErrorMessage() {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Noe gikk galt :(');
    h3.append(text);
    appendToOpptjeningApp(h3);
}

function renderAppInLoadingState() {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Vennligst vent, siden laster...');
    h3.classList.add(loadingMessageCls);
    h3.append(text);
    appendToOpptjeningApp(h3);
}

function renderAppInSuccessfulState(appId, opptjeningData, aksjonspunktService) {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Opptjeningsperioder');
    h3.append(text);

    toggleElementByCls(loadingMessageCls);
-    appendToOpptjeningApp(h3, appId);

    const { opptjeninger } = opptjeningData;
    opptjeninger.forEach((opptjening) => {
        appendToOpptjeningApp(renderOpptjeningTable(opptjening), appId)
    });
}

export default {
    renderAppInSuccessfulState,
    renderAppInLoadingState,
    renderErrorMessage
}
