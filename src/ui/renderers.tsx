import React from 'react';
import { render } from 'react-dom';
import Sykdom from '../types/medisinsk-vilkår/sykdom';
import MainComponent from './MainComponent';

const renderAppInSuccessfulState = (appId: string, sykdom: Sykdom) =>
    render(<MainComponent sykdom={sykdom} />, document.getElementById(appId));

export default {
    renderAppInSuccessfulState,
};
