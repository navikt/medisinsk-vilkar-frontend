import regeneratorRuntime from 'regenerator-runtime'; // (needed for async fns, see https://github.com/babel/babel/issues/9849)
import renderUtils from './renderUtils';
import mockedOpptjeningData from "./mock/mockedOpptjeningData";

function getBehandlingUuid() {
    return new Promise((resolve, reject) => {
        let behandlingUuid = null;
        document.addEventListener('opptjening:behandlingUuid', (event) => {
            behandlingUuid = event.detail.behandlingUuid;
            resolve(behandlingUuid);
        });
        setTimeout(() => {
            reject('Getting behandlingUuid has timed out')
        }, 2500)
    });
}

async function getOpptjeningData(behandlingUuid) {
    const response = await fetch(`/k9/sak/api/behandling/opptjening-v3?behandlingUuid=${behandlingUuid}`, {
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
        const behandlingUuid = await getBehandlingUuid();
        if (behandlingUuid !== null) {
            opptjeningData = await getOpptjeningData(behandlingUuid);
        }
    }
    catch (error) {
        console.error(error);
        renderErrorMessage(appId);
    }
    renderAppInSuccessfulState(appId, opptjeningData);
};
