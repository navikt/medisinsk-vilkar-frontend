import React from 'react';
import { render } from 'react-dom';
import MainComponent from './MainComponent';

function renderAppInSuccessfulState(appId) {
    render(<MainComponent />, document.getElementById(appId));
}

export default {
    renderAppInSuccessfulState,
};
