import { createElement } from "./utils";

const formId = 'aktivitetGodkjentForm';
export function toggleForm(aktivitet, appElement) {
    const formEl = document.getElementById(formId);
    if (formEl === null) {
        const radioGroupName = 'godkjenningStatus';

        const formElement = createElement('form', { id: 'aktivitetGodkjentForm' });
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('submitting');
            // const index = newOpptjeningData.aktiviteter.indexOf(aktivitet);
            // newOpptjeningData.aktiviteter[index] = { ...aktivitet, klasse: { kode: getSelectedRadioValue(radioGroupName) } };
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
