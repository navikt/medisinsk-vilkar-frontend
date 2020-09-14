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
    const rowGroup = document.createElement('div');
    rowGroup.classList = 'aktivitetTabell__thead';
    rowGroup.setAttribute('role', 'row-group');

    const row = document.createElement('div');
    row.classList.add('aktivitetTabell__tr');
    row.setAttribute('role', 'row')

    labels.map((label) => {
        const rowContent = document.createTextNode(label)
        const labelElement = document.createElement('div');
        labelElement.classList.add('aktivitetTabell__th');
        labelElement.setAttribute('role', 'columnheader');
        labelElement.appendChild(rowContent);
        row.append(labelElement);
    });

    rowGroup.appendChild(row);
    return rowGroup;
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

function addColumnToTableRow(text, rowElement) {
    const column = document.createElement('div');
    column.classList.add('aktivitetTabell__td');
    column.setAttribute('role', 'cell');
    column.appendChild(document.createTextNode(text));
    rowElement.appendChild(column);
}

function createAktivitetTableRow(aktivitet) {
    const row = document.createElement('div');
    row.classList.add('aktivitetTabell__tr');
    row.setAttribute('role', 'row');

    row.addEventListener('click', () => toggleForm(aktivitet));
    addColumnToTableRow(aktivitet.klasse?.kode, row);
    addColumnToTableRow(`${aktivitet.aktivitetsperiode.fom}-${aktivitet.aktivitetsperiode.tom}`, row);
    addColumnToTableRow(aktivitet.arbeidsgiverNavn, row);
    addColumnToTableRow(aktivitet.type.kode, row);
    addColumnToTableRow(`${aktivitet.stillingsandel}%`, row);
    return row;
}

function renderOpptjeningTable(opptjeningData) {
    const table = document.createElement('div');
    table.classList.add('aktivitetTabell');
    table.setAttribute('role', 'table');

    const tableHead = createTableHeader(['Status', 'Periode', 'Arbeidsgiver', 'Aktivitet', 'Stillingsandel']);
    table.appendChild(tableHead);

    const tableBody = document.createElement('div');
    tableBody.classList.add('aktivitetTabell__tbody');
    tableBody.setAttribute('role', 'row-group');

    opptjeningData.aktiviteter.forEach((aktivitet) => {
        tableBody.appendChild(createAktivitetTableRow(aktivitet));
    });
    table.appendChild(tableBody);

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
