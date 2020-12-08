import * as React from 'react';

const id = 'scenario-picker';

const Scenariovelger = ({ setScenario }) => (
    <div>
        <label htmlFor={id} style={{ marginRight: '0.5rem' }}>
            Velg scenario
        </label>
        <select id={id} onChange={(event) => setScenario(event.target.value)}>
            <option value={0}>Mor som søker</option>
            <option value={1}>Far som søker</option>
        </select>
    </div>
);

export default Scenariovelger;
