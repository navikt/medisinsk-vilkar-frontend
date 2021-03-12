import * as React from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Box, { Margin } from '../box/Box';
import styles from './form.less';

interface FormProps {
    children: React.ReactNode;
    buttonLabel?: string;
    onSubmit: (e?: any) => void;
    shouldShowSubmitButton?: boolean;
    onAvbryt?: () => void;
}

const Form = ({ children, onSubmit, buttonLabel, shouldShowSubmitButton, onAvbryt }: FormProps): JSX.Element => {
    return (
        <form onSubmit={onSubmit}>
            {children}
            {shouldShowSubmitButton !== false && (
                <Box marginTop={Margin.xxLarge}>
                    <div className={styles.buttonContainer}>
                        <Hovedknapp id="submitButton">{buttonLabel}</Hovedknapp>
                        {onAvbryt && (
                            <div className={styles.buttonContainer__avbryt}>
                                <Knapp htmlType="button" onClick={onAvbryt}>
                                    Avbryt
                                </Knapp>
                            </div>
                        )}
                    </div>
                </Box>
            )}
        </form>
    );
};
export default Form;
