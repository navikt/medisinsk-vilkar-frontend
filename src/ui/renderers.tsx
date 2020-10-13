import React from 'react';
import { render } from 'react-dom';
import MainComponent from './components/MainComponent';
import Sykdom from '../types/medisinsk-vilkår/sykdom';

const renderAppInSuccessfulState = (appId: string, sykdom: Sykdom) =>
    render(<MainComponent sykdom={sykdom} />, document.getElementById(appId));

export default {
    renderAppInSuccessfulState,
};
