import regeneratorRuntime from 'regenerator-runtime'; // (needed for async fns, see https://github.com/babel/babel/issues/9849)
import renderUtils from './renderUtils';

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
    const response = await fetch(`/k9/sak/api/behandling/opptjening-v2?behandlingUuid=${behandlingUuid}`, {
        credentials: 'same-origin'
    });
    const data = await response.json();
    return data;
}

window.renderOpptjeningApp = async (appId) => {
    const { renderAppInSuccessfulState, renderErrorMessage, renderAppInLoadingState } = renderUtils;
    renderAppInLoadingState(appId);
    try {
        const behandlingUuid = await getBehandlingUuid();
        if (behandlingUuid !== null) {
            const opptjeningData = await getOpptjeningData(behandlingUuid);
            renderAppInSuccessfulState(appId, opptjeningData);
        }
    }
    catch (error) {
        renderErrorMessage(appId);
    }
};
