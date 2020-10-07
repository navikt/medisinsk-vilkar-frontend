import renderers from './ui/renderers';

window.renderMedisinskVilkarApp = async (appId) => {
    const { renderAppInSuccessfulState } = renderers;
    renderAppInSuccessfulState(appId);
};
