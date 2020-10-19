import Autocomplete from '@navikt/nap-autocomplete';
import axios from 'axios';
import { Label } from 'nav-frontend-skjema';
import * as React from 'react';
import { Control, Controller } from 'react-hook-form';
import styles from './diagnosekodeSelector.less';

const fetchDiagnosekoderByQuery = (queryString: string) => {
    return axios.get(`/k9/diagnosekoder?query=${queryString}&max=8`);
};

const getUpdatedSuggestions = async (queryString: string) => {
    if (queryString.length >= 3) {
        const diagnosekoder = await fetchDiagnosekoderByQuery(queryString);
        return diagnosekoder.data.map(({ kode, beskrivelse }) => ({
            key: kode,
            value: `${kode} - ${beskrivelse}`,
        }));
    }
    return [];
};

interface DiagnosekodeSelektorProps {
    control: Control;
    initialDiagnosekodeValue?: string;
}

const DiagnosekodeSelektor = ({
    control,
    initialDiagnosekodeValue = '',
}: DiagnosekodeSelektorProps): JSX.Element => {
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
            <Label htmlFor="legeerklæringDiagnose">Er det fastsatt en diagnose?</Label>
            <Controller
                control={control}
                name="legeerklæringDiagnose"
                defaultValue={initialDiagnosekodeValue}
                render={(props) => (
                    <Autocomplete
                        id="legeerklæringDiagnose"
                        suggestions={suggestions}
                        value={inputValue}
                        onChange={onInputValueChange}
                        onSelect={(e) => {
                            onInputValueChange(e.value);
                            props.onChange(e.value);
                        }}
                        ariaLabel="Søk etter diagnose"
                        placeholder="Søk etter diagnose"
                    />
                )}
            />
        </div>
    );
};

export default DiagnosekodeSelektor;
