import regeneratorRuntime from 'regenerator-runtime'; // (needed for async fns, see https://github.com/babel/babel/issues/9849)
import mockedOpptjeningData from './mock/mockedOpptjeningData';
import renderers from './ui/renderers';
import './ui/aktivitetTabell.scss';

let aksjonspunktService = null;

function getOpptjeningPath() {
    return new Promise((resolve, reject) => {
        let opptjeningPath = null;
        document.addEventListener('init:opptjening', (event) => {
            opptjeningPath = event.detail.services.opptjening.path;
            aksjonspunktService = event.detail.services.aksjonspunkt;
            resolve(opptjeningPath);
        });
        setTimeout(() => {
            reject('Getting opptjeningPath has timed out');
        }, 2500);
    });
}

async function getOpptjeningData(opptjeningPath) {
    const response = await fetch(opptjeningPath, {
        credentials: 'same-origin',
    });
    const data = await response.json();
    return data;
}

window.renderOpptjeningApp = async (appId, useMock) => {
    const { renderAppInSuccessfulState, renderErrorMessage, renderAppInLoadingState } = renderers;

    renderAppInLoadingState(appId);
    if (useMock) {
        return renderAppInSuccessfulState(appId, mockedOpptjeningData);
    }

    let opptjeningData = null;
    try {
        const opptjeningPath = await getOpptjeningPath();
        if (opptjeningPath !== null) {
            opptjeningData = await getOpptjeningData(opptjeningPath);
        }
    } catch (error) {
        console.error(error);
        renderErrorMessage(appId);
    }
    renderAppInSuccessfulState(appId, opptjeningData, aksjonspunktService);
};
