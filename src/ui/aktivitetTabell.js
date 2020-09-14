import { createElement } from "./utils";
import {toggleForm} from "./form";

function createAktivitetTableHeader(labels) {
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

function addColumnToTableRow(text, rowElement) {
    const col = createElement('div', { classList: ['aktivitetTabell__td'], role: 'cell' });
    col.appendChild(document.createTextNode(text));
    rowElement.appendChild(col);
}

function createAktivitetTableRow(aktivitet) {
    const row = createElement('div', { classList: ['aktivitetTabell__tr'], role: 'row' });
    addColumnToTableRow(aktivitet.klasse?.kode, row);
    addColumnToTableRow(`${aktivitet.aktivitetsperiode.fom}-${aktivitet.aktivitetsperiode.tom}`, row);
    addColumnToTableRow(aktivitet.arbeidsgiverNavn, row);
    addColumnToTableRow(aktivitet.type.kode, row);
    addColumnToTableRow(`${aktivitet.stillingsandel}%`, row);
    return row;
}

let newOpptjeningData = null;
export function renderOpptjeningTable(opptjeningData) {
    newOpptjeningData = opptjeningData;

    const table = createElement('div', { classList: ['aktivitetTabell'], role: 'table' });

    const tableHead = createAktivitetTableHeader(['Status', 'Periode', 'Arbeidsgiver', 'Aktivitet', 'Stillingsandel']);
    table.appendChild(tableHead);

    const tableBody = createElement('div', { classList: ['aktivitetTabell__tbody'], role: 'row-group' });
    opptjeningData.aktiviteter.forEach((aktivitet) => {
        tableBody.appendChild(createAktivitetTableRow(aktivitet));
    });

    table.appendChild(tableBody);

    return table;
}

