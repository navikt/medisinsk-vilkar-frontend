import { BodyShort, Label } from '@navikt/ds-react';
import { Autocomplete, FieldError } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import Diagnosekode from '../../../types/Diagnosekode';
import DeleteButton from '../../components/delete-button/DeleteButton';
import styles from './diagnosekodeSelector.css';

interface DiagnosekodeSelectorProps {
    label: string;
    onChange: (value) => void;
    name: string;
    errorMessage?: string;
    initialDiagnosekodeValue: string;
    hideLabel?: boolean;
    selectedDiagnosekoder: string[];
}

const fetchDiagnosekoderByQuery = (queryString: string) =>
    fetch(`/k9/diagnosekoder/?query=${queryString}&max=8`).then((response) => response.json());

const PureDiagnosekodeSelector = ({
    label,
    onChange,
    name,
    errorMessage,
    initialDiagnosekodeValue,
    hideLabel,
    selectedDiagnosekoder,
}: DiagnosekodeSelectorProps): JSX.Element => {
    const [suggestions, setSuggestions] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const getUpdatedSuggestions = async (queryString: string) => {
        if (queryString.length >= 3) {
            setIsLoading(true);
            const diagnosekoder: Diagnosekode[] = await fetchDiagnosekoderByQuery(queryString);
            setIsLoading(false);
            return diagnosekoder.map(({ kode, beskrivelse }) => ({
                key: kode,
                value: `${kode} - ${beskrivelse}`,
            }));
        }
        return [];
    };

    React.useEffect(() => {
        const getInitialDiagnosekode = async () => {
            const diagnosekode = await getUpdatedSuggestions(initialDiagnosekodeValue);
            if (diagnosekode.length > 0 && diagnosekode[0].value) {
                setInputValue(diagnosekode[0].value);
            }
        };
        getInitialDiagnosekode();
    }, [initialDiagnosekodeValue]);

    const onInputValueChange = async (v) => {
        const newSuggestionList = await getUpdatedSuggestions(v);
        setSuggestions(newSuggestionList);
    };

    const removeDiagnosekode = (diagnosekodeToRemove: string) =>
        onChange(selectedDiagnosekoder.filter((selectedDiagnosekode) => selectedDiagnosekode !== diagnosekodeToRemove));

    return (
        <div className={styles.diagnosekodeContainer}>
            <div className={hideLabel ? styles.diagnosekodeContainer__hideLabel : ''}>
                <Label as="label" htmlFor={name}>
                    {label}
                </Label>
            </div>
            <div className={styles.diagnosekodeContainer__autocompleteContainer}>
                <Autocomplete
                    id={name}
                    suggestions={suggestions}
                    value={inputValue}
                    onChange={(e) => {
                        onInputValueChange(e);
                        setInputValue(e);
                    }}
                    onSelect={(e) => {
                        setInputValue('');
                        if (!selectedDiagnosekoder.includes(e.key)) {
                            onChange([...selectedDiagnosekoder, e.key]);
                        }
                    }}
                    ariaLabel="Søk etter diagnose"
                    placeholder="Søk etter diagnose"
                    shouldFocusOnMount
                    isLoading={isLoading}
                />
            </div>
            {errorMessage && <FieldError message={errorMessage} />}
            {selectedDiagnosekoder.length > 0 && (
                <ul className={styles.diagnosekodeContainer__diagnosekodeList}>
                    {selectedDiagnosekoder.map((selectedDiagnosekode) => (
                        <li key={selectedDiagnosekode}>
                            <BodyShort size="small">{selectedDiagnosekode}</BodyShort>
                            <DeleteButton onClick={() => removeDiagnosekode(selectedDiagnosekode)} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PureDiagnosekodeSelector;
