import React from 'react';
import { QueryClientProvider } from 'react-query';
import 'nav-datovelger/lib/styles/main.css';
import 'nav-frontend-chevron-style/dist/main.css';
import 'nav-frontend-alertstriper-style/dist/main.css';
import 'nav-frontend-ekspanderbartpanel-style/dist/main.css';
import 'nav-frontend-etiketter-style/dist/main.css';
import 'nav-frontend-knapper-style/dist/main.css';
import 'nav-frontend-lenker-style/dist/main.css';
import 'nav-frontend-lukknapp-style/dist/main.css';
import 'nav-frontend-modal-style/dist/main.css';
import 'nav-frontend-paneler-style/dist/main.css';
import 'nav-frontend-skjema-style/dist/main.css';
import 'nav-frontend-spinner-style/dist/main.css';
import 'nav-frontend-typografi-style/dist/main.css';
import 'nav-frontend-tabs-style/dist/main.css';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import '@navikt/ds-css';
import ContainerContext from './context/ContainerContext';
import queryClient from './context/queryClient';
import ContainerContract from '../types/ContainerContract';
import MedisinskVilkår from './components/medisinsk-vilkår/MedisinskVilkår';

interface MainComponentProps {
    containerData: ContainerContract;
}

const MainComponent = ({ containerData }: MainComponentProps): JSX.Element => (
    <div id="medisinskVilkår">
        <QueryClientProvider client={queryClient}>
            <ContainerContext.Provider value={containerData}>
                <MedisinskVilkår />
            </ContainerContext.Provider>
        </QueryClientProvider>
    </div>
);

export default MainComponent;
