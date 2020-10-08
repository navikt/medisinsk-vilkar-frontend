import renderers from './ui/renderers';

(window as any).renderMedisinskVilkarApp = async (appId) => {
    const { renderAppInSuccessfulState } = renderers;
    renderAppInSuccessfulState(appId);
};
