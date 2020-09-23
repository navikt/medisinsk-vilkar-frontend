import regeneratorRuntime from 'regenerator-runtime'; // (needed for async fns, see https://github.com/babel/babel/issues/9849)
import mockedOpptjeningData from './mock/mockedOpptjeningData';
import renderers from './ui/renderers';
import './ui/aktivitetTabell.scss';

let aksjonspunktService = null;

// rename this fn
function getOpptjeningInitData() {
    return new Promise((resolve, reject) => {
        let opptjeningPath = null;
        document.addEventListener('init:opptjening', (event) => {
            opptjeningPath = event.detail.services.opptjening.path;
            aksjonspunktService = event.detail.services.aksjonspunkt;
            resolve({ opptjeningPath, onSubmit: event.detail.onSubmit });
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
        return renderAppInSuccessfulState(appId, mockedOpptjeningData, (data) => {
            console.log('Submit', data);
        });
    }

    let opptjeningData = null;
    let onSubmit = null;
    try {
        const initData = await getOpptjeningInitData();
        const opptjeningPath = initData.opptjeningPath;
        onSubmit = initData.onSubmit;
        if (opptjeningPath !== null) {
            opptjeningData = await getOpptjeningData(opptjeningPath);
        }
    } catch (error) {
        console.error(error);
        renderErrorMessage(appId);
    }
    renderAppInSuccessfulState(appId, opptjeningData, onSubmit);
};
