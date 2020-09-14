function toggleElementByCls(classname) {
    const element = document.querySelector(`.${classname}`);
    if (element !== null) {
        const { display } = element.style;
        if (display === 'none') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
}

function createElement(tagName, options) {
    const { role, ...otherOptions } = options;

    const el = document.createElement(tagName);
    if (role) {
        el.setAttribute('role', role);
    }

    Object.keys(otherOptions).forEach((optionName) => {
       el[optionName] = otherOptions[optionName];
    });

    return el;
}

function getSelectedRadioValue(groupName) {
    return document.querySelector(`input[name=${groupName}]:checked`)?.value;
}

function appendToOpptjeningApp(element, appId) {
    const appElement = document.getElementById(appId || 'opptjeningApp');
    if (appElement !== null) {
        appElement.appendChild(element);
    }
}

export {
    createElement,
    getSelectedRadioValue,
    toggleElementByCls,
    appendToOpptjeningApp
}
