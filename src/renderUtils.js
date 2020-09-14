import './aktivitetTabell.scss';
import {createElement} from "./ui/utils";


let appElement = null;
let newOpptjeningData = {};
let aksjonspunktService = null;

function appendToOpptjeningApp(element, appId) {
    if (appElement === null) {
        appElement = document.getElementById(appId || 'opptjeningApp');
    }
    if (appElement !== null) {
        appElement.appendChild(element);
    }
}

function createTableHeader(labels) {
    const thead = createElement('div', { classList: ['aktivitetTabell__thead'], role: 'row-group' });
    const tr = createElement('div', { classList: ['aktivitetTabell__tr'], role: 'row' });

    labels.map((labelText) => {
        const rowContent = document.createTextNode(labelText);
        const labelElement = createElement('div', { classList: ['aktivitetTabell__th'], role: 'columnheader' });
        labelElement.appendChild(rowContent);
        tr.append(labelElement);
    });

    thead.appendChild(tr);
    return thead;
}

function getSelectedRadioValue(groupName) {
    return document.querySelector(`input[name=${groupName}]:checked`)?.value;
}

const formId = 'aktivitetGodkjentForm';
function toggleForm(aktivitet) {
    const formEl = document.getElementById(formId);
    if (formEl === null) {
        const radioGroupName = 'godkjenningStatus';

        const formElement = createElement('form', { id: 'aktivitetGodkjentForm' });
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log(newOpptjeningData);
            const index = newOpptjeningData.aktiviteter.indexOf(aktivitet);
            newOpptjeningData.aktiviteter[index] = { ...aktivitet, klasse: { kode: getSelectedRadioValue(radioGroupName) } };
            const event = new CustomEvent('opptjening:aksjonspunkt');
            document.dispatchEvent(event);
        });

        const submitButton = createElement('input', { type: 'submit', innerHTML: 'Lagre' });
        const godkjentRadio = createElement('input', { type: 'radio', name: radioGroupName, value: 'godkjent' });
        const godkjentLabel = createElement('label', { innerHTML: 'Godkjent', htmlFor: 'godkjent' });
        const ikkeGodkjentRadio = createElement('input', { type: 'radio', name: radioGroupName, htmlFor: 'ikkeGodkjent' });
        const ikkeGodkjentLabel = createElement('label', { innerHTML: 'Ikke godkjent', htmlFor: 'ikkeGodkjent' });

        formElement.append(godkjentRadio, godkjentLabel, ikkeGodkjentRadio, ikkeGodkjentLabel, submitButton);
        appElement.append(formElement);
    } else if (formEl.offsetParent === null) {
        formEl.style.display = 'block'
    } else {
        formEl.style.display = 'none';
    }
}

function addColumnToTableRow(text, rowElement) {
    const col = createElement('div', { classList: ['aktivitetTabell__td'], role: 'cell' });
    col.appendChild(document.createTextNode(text));
    rowElement.appendChild(col);
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
    newOpptjeningData = opptjeningData;

    const table = createElement('div', { classList: ['aktivitetTabell'], role: 'table' });

    const tableHead = createTableHeader(['Status', 'Periode', 'Arbeidsgiver', 'Aktivitet', 'Stillingsandel']);
    table.appendChild(tableHead);

    const tableBody = createElement('div', { classList: ['aktivitetTabell__body'], role: 'row-group' });

    opptjeningData.aktiviteter.forEach((aktivitet) => {
        tableBody.appendChild(createAktivitetTableRow(aktivitet));
    });
    table.appendChild(tableBody);

    return table;
}

export {
    renderOpptjeningTable, appendToOpptjeningApp
}
