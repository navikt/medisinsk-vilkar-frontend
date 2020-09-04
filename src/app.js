const createTextElement = (type, text) => {
    const elem = document.createElement(type);
    const textChildren = document.createTextNode(text);
    elem.appendChild(textChildren);
    return elem;
};

const appendToApp = (appId, element) => {
    const appElement = document.getElementById(appId);
    appElement.appendChild(element)
};

const createHeading = (text) => {
    return (createTextElement('h3', text))
};

window.renderOpptjeningApp = () => {
    document.addEventListener('got-some-data', async (event) => {
        const behandlingUuid = event.detail.behandlingUuid;
        const response = await fetch(`/k9/sak/api/behandling/opptjening-v2?behandlingUuid=${behandlingUuid}`, {
            credentials: 'same-origin'
        });
        const data = await response.json();
        console.log(data.opptjeninger);
    });

    setTimeout(async () => {
        const responseAp = await fetch('/k9/sak/api/behandling/aksjonspunkt', { method: 'POST', credentials: 'same-origin'});
        let event = null;
        if (responseAp.ok === false) {
            event = new CustomEvent('opptjening-aksjonspunkt-failed', { detail: [{ data: '123' }]});
        } else {
            event = new CustomEvent('opptjening-aksjonspunkt-solved', { detail: [{ data: '123' }]});
        }
        document.dispatchEvent(event);
    }, 3500);

    return appendToApp('opptjeningApp', createHeading('Opptjeningsperioder'))
};
