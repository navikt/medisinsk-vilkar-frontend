import regeneratorRuntime from 'regenerator-runtime'; // (needed for async fns, see https://github.com/babel/babel/issues/9849)
import renderUtils from './renderUtils';
import mockedOpptjeningData from "./mock/mockedOpptjeningData";

function getOpptjeningPath() {
    return new Promise((resolve, reject) => {
        let opptjeningPath = null;
        document.addEventListener('path:opptjening', (event) => {
            opptjeningPath = event.detail.opptjeningPath;
            resolve(opptjeningPath);
        });
        setTimeout(() => {
            reject('Getting opptjeningPath has timed out')
        }, 2500)
    });
}

async function getOpptjeningData(opptjeningPath) {
    const response = await fetch(opptjeningPath, {
        credentials: 'same-origin'
    });
    const data = await response.json();
    return data;
}

window.renderOpptjeningApp = async (appId, useMock) => {
    const { renderAppInSuccessfulState, renderErrorMessage, renderAppInLoadingState } = renderUtils;

    renderAppInLoadingState(appId);
    if (useMock) {
        return renderAppInSuccessfulState(appId, mockedOpptjeningData)
    }

    let opptjeningData = null;
    try {
        const opptjeningPath = await getOpptjeningPath();
        if (opptjeningPath !== null) {
            opptjeningData = await getOpptjeningData(opptjeningPath);
        }
    }
    catch (error) {
        console.error(error);
        renderErrorMessage(appId);
    }
    renderAppInSuccessfulState(appId, opptjeningData);
};
