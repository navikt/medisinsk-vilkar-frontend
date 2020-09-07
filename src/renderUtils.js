function renderErrorMessage(appId) {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Noe gikk dårlig :(');
    h3.append(text);
    document.getElementById(appId).appendChild(h3);
}

function renderAppInLoadingState(appId) {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Vennligst vent, siden laster...');
    h3.append(text);
    document.getElementById(appId).appendChild(h3);
}

function renderAppInSuccessfulState(appId, opptjeningData) {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Har data :)');
    h3.append(text);
    document.getElementById(appId).appendChild(h3);
    console.log(opptjeningData);
}

export default {
    renderAppInSuccessfulState,
    renderAppInLoadingState,
    renderErrorMessage
}
