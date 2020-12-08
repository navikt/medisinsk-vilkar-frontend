import * as React from 'react';
import { Select } from 'nav-frontend-skjema';

const Scenariovelger = ({ setScenario }): JSX.Element => (
    <Select label="Velg scenario" onChange={(event) => setScenario(+event.target.value)} bredde="m">
        <option value={0}>Mor som søker</option>
        <option value={1}>Far som søker</option>
    </Select>
);

export default Scenariovelger;
