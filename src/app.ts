import renderers from './util/renderers';
import ContainerContract from './types/ContainerContract';

interface ExtendedWindow extends Window {
    renderMedisinskVilkarApp: (id: string, contract: ContainerContract) => void;
}

(window as Partial<ExtendedWindow>).renderMedisinskVilkarApp = async (appId, data: ContainerContract) => {
    const { renderAppInSuccessfulState } = renderers;
    renderAppInSuccessfulState(appId, data);
};
