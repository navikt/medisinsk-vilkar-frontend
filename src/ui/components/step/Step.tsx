import { Hovedknapp } from 'nav-frontend-knapper';
import * as React from 'react';
import Box, { Margin } from '../box/Box';
import styles from './step.less';

interface StepProps {
    children: React.ReactNode;
    buttonLabel: string;
    onSubmit: () => void;
    shouldShowSubmitButton?: boolean;
}

const Step = ({ children, onSubmit, buttonLabel, shouldShowSubmitButton }: StepProps): JSX.Element => {
    return (
        <div className={styles.stepContainer}>
            <form onSubmit={onSubmit}>
                {children}
                {shouldShowSubmitButton !== false && (
                    <Box marginTop={Margin.xLarge}>
                        <Hovedknapp>{buttonLabel}</Hovedknapp>
                    </Box>
                )}
            </form>
        </div>
    );
};
export default Step;
