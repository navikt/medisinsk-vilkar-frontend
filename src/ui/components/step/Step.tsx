import { Hovedknapp } from 'nav-frontend-knapper';
import * as React from 'react';
import Box, { Margin } from '../box/Box';
import styles from './step.less';

interface StepProps {
    children: React.ReactNode;
    onSubmit: () => void;
    buttonLabel: string;
}

const Step = ({ children, onSubmit, buttonLabel }: StepProps): JSX.Element => {
    return (
        <div className={styles.stepContainer}>
            <form onSubmit={onSubmit}>
                {children}
                <Box marginTop={Margin.xLarge}>
                    <Hovedknapp>{buttonLabel}</Hovedknapp>
                </Box>
            </form>
        </div>
    );
};
export default Step;
