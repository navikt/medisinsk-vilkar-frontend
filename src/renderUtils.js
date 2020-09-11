import './aktivitetTabell.scss';

const loadingMessageCls = 'loadingMessage';

let appElement = null;
let newOpptjeningData = {};

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

function appendToOpptjeningApp(element, appId) {
    if (appElement === null) {
        appElement = document.getElementById(appId || 'opptjeningApp');
    }
    if (appElement !== null) {
        appElement.appendChild(element);
    }
}

function renderErrorMessage(appId) {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Noe gikk galt :(');
    h3.append(text);
    appendToOpptjeningApp(h3);
}

function renderAppInLoadingState(appId) {
    const h3 = document.createElement('h3');
    const text = document.createTextNode('Vennligst vent, siden laster...');
    h3.classList.add(loadingMessageCls);
    h3.append(text);
    appendToOpptjeningApp(h3);
}

function createTableHeader(labels) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    tr.classList.add('tableHeaderRow')
    labels.map((label) => {
        const thContent = document.createTextNode(label)
        const th = document.createElement('th');
        th.appendChild(thContent)
        tr.append(th);
    });
    thead.appendChild(tr);
    return thead;
}

function addColumnToTableRow(text, trElement) {
    const td = document.createElement('td');
    td.appendChild(document.createTextNode(text));
    trElement.appendChild(td);
}

function getSelectedRadioValue(groupName) {
    return document.querySelector(`input[name=${groupName}]:checked`)?.value;
}

function toggleForm(aktivitet) {
    const form = document.createElement('form');
    const radioGroupName = 'godkjenningStatus';

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const index = newOpptjeningData.opptjeninger[0].aktiviteter.indexOf(aktivitet);
        newOpptjeningData.opptjeninger[0].aktiviteter[index] = { ...aktivitet, klasse: { kode: getSelectedRadioValue(radioGroupName) } };
    });

    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.innerHTML = 'Lagre';

    const godkjentRadio = document.createElement('input');
    godkjentRadio.type = 'radio';
    godkjentRadio.name = radioGroupName;
    godkjentRadio.value = 'godkjent';

    const godkjentLabel = document.createElement('label');
    godkjentLabel.innerHTML = 'Godkjent';
    godkjentLabel.htmlFor = 'godkjent';

    const ikkeGodkjentRadio = document.createElement('input');
    ikkeGodkjentRadio.type = 'radio';
    ikkeGodkjentRadio.name = radioGroupName;
    ikkeGodkjentRadio.value = 'ikkeGodkjent';

    const ikkeGodkjentLabel = document.createElement('label');
    ikkeGodkjentLabel.innerHTML = 'Ikke godkjent';
    ikkeGodkjentLabel.htmlFor = 'ikkeGodkjent';

    form.append(godkjentRadio, godkjentLabel, ikkeGodkjentRadio, ikkeGodkjentLabel, submitButton);
    appElement.append(form);
}

function createAktivitetTableRow(aktivitet) {
    const tr = document.createElement('tr');
    tr.classList.add('tableRow');
    tr.addEventListener('click', () => toggleForm(aktivitet));
    addColumnToTableRow(aktivitet.klasse?.kode, tr);
    addColumnToTableRow(`${aktivitet.aktivitetsperiode.fom}-${aktivitet.aktivitetsperiode.tom}`, tr);
    addColumnToTableRow(aktivitet.arbeidsgiverNavn, tr);
    addColumnToTableRow(aktivitet.type.kode, tr);
    addColumnToTableRow(`${aktivitet.stillingsandel}%`, tr);
    return tr;
}

function renderOpptjeningTable(opptjeningData) {
    const table = document.createElement('table');
    table.classList.add('aktivitetTabell');

    const thead = createTableHeader(['Status', 'Periode', 'Arbeidsgiver', 'Aktivitet', 'Stillingsandel']);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    opptjeningData.aktiviteter.forEach((aktivitet) => {
        tbody.appendChild(createAktivitetTableRow(aktivitet));
    });
    table.appendChild(tbody);

    return table;
}

function renderAppInSuccessfulState(appId, opptjeningData) {
    newOpptjeningData = opptjeningData;

    const h3 = document.createElement('h3');
    const text = document.createTextNode('Opptjeningsperioder');
    h3.append(text);
    toggleElementByCls(loadingMessageCls);
    appendToOpptjeningApp(h3, appId);

    const { opptjeninger } = opptjeningData;
    opptjeninger.forEach((opptjening) => {
        appendToOpptjeningApp(renderOpptjeningTable(opptjening), appId)
    });
}

export default {
    renderAppInSuccessfulState,
    renderAppInLoadingState,
    renderErrorMessage
}
