import renderers from './util/renderers';

(window as any).renderMedisinskVilkarApp = async (appId, data) => {
    const { renderAppInSuccessfulState } = renderers;
    renderAppInSuccessfulState(appId, data);
};
