import * as React from 'react';
import { Label } from 'nav-frontend-skjema';
import Autocomplete from '@navikt/nap-autocomplete';
import FieldError from '../../components/field-error/FieldError';
import styles from './diagnosekodeSelector.less';
import Diagnosekode from '../../../types/Diagnosekode';

interface DiagnosekodeSelectorProps {
    label: string;
    onChange: (value) => void;
    name: string;
    errorMessage?: string;
    initialDiagnosekodeValue: string;
    hideLabel?: boolean;
}

const fetchDiagnosekoderByQuery = (queryString: string) => {
    const useMock = window.location.host === 'localhost:8081' ? 'http://localhost:8082' : ''; // TODO: Bedre måte å løse dette
    return fetch(`${useMock}/k9/diagnosekoder?query=${queryString}&max=8`).then((response) => response.json());
};

const getUpdatedSuggestions = async (queryString: string) => {
    if (queryString.length >= 3) {
        const diagnosekoder: Diagnosekode[] = await fetchDiagnosekoderByQuery(queryString);
        return diagnosekoder.map(({ kode, beskrivelse }) => ({
            key: kode,
            value: `${kode} - ${beskrivelse}`,
        }));
    }
    return [];
};

const PureDiagnosekodeSelector = ({
    label,
    onChange,
    name,
    errorMessage,
    initialDiagnosekodeValue,
    hideLabel,
}: DiagnosekodeSelectorProps): JSX.Element => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        const getInitialDiagnosekode = async () => {
            const diagnosekode:
                | {
                      value: string;
                  }[]
                | [] = await getUpdatedSuggestions(initialDiagnosekodeValue);
            if (diagnosekode.length > 0 && diagnosekode[0].value) {
                setInputValue(diagnosekode[0].value);
            }
        };
        getInitialDiagnosekode();
    }, [initialDiagnosekodeValue]);

    const onInputValueChange = async (v) => {
        setInputValue(v);
        const newSuggestionList = await getUpdatedSuggestions(v);
        setSuggestions(newSuggestionList);
    };
    return (
        <div className={styles.diagnosekodeContainer}>
            <div className={hideLabel ? styles.diagnosekodeContainer__hideLabel : ''}>
                <Label htmlFor={name}>{label}</Label>
            </div>
            <Autocomplete
                id={name}
                suggestions={suggestions}
                value={inputValue}
                onChange={onInputValueChange}
                onSelect={(e) => {
                    onInputValueChange(e.value);
                    onChange(e.value);
                }}
                ariaLabel="Søk etter diagnose"
                placeholder="Søk etter diagnose"
            />
            {errorMessage && <FieldError message={errorMessage} />}
        </div>
    );
};

export default PureDiagnosekodeSelector;
