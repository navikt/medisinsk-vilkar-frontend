import renderers from './ui/renderers';
import mockedSykdom from './mock/mockedSykdom';

(window as any).renderMedisinskVilkarApp = async (appId, data) => {
    const sykdom = data || mockedSykdom;
    const { renderAppInSuccessfulState } = renderers;
    renderAppInSuccessfulState(appId, sykdom);
};
