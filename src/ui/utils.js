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

export {
    createElement,
    toggleElementByCls
}
