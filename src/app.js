import regeneratorRuntime from 'regenerator-runtime'; // (needed for async fns, see https://github.com/babel/babel/issues/9849)
import mockedOpptjeningData from './mock/mockedOpptjeningData';
import renderers from './ui/renderers';
import './ui/aktivitetTabell.scss';

async function getOpptjeningData(opptjeningPath) {
    const response = await fetch(opptjeningPath, {
        credentials: 'same-origin',
    });
    const data = await response.json();
    return data;
}

window.renderOpptjeningApp = async (appId, config, useMock) => {
    const { renderAppInSuccessfulState, renderErrorMessage, renderAppInLoadingState } = renderers;

    renderAppInLoadingState(appId);
    if (useMock) {
        return renderAppInSuccessfulState(appId, mockedOpptjeningData, (data) => {
            console.log('Submit', data);
        });
    }

    let opptjeningData = null;
    try {
        const opptjeningPath = config.services.opptjening.path;
        if (opptjeningPath !== null) {
            opptjeningData = await getOpptjeningData(opptjeningPath);
        }
    } catch (error) {
        console.error(error);
        renderErrorMessage(appId);
    }

    renderAppInSuccessfulState(appId, opptjeningData, config.onSubmit);
};
