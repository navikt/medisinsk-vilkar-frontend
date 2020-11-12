import * as React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import styles from './step.less';

interface StepHeaderProps {
    title: string;
    contentRenderer?: () => React.ReactNode;
}

interface StepProps {
    headerProps?: StepHeaderProps;
    children: React.ReactNode;
}

const StepHeader = ({ title, contentRenderer }: StepHeaderProps) => {
    return (
        <>
            <div className={styles.stepContainer__stepHeader}>
                <Systemtittel>{title}</Systemtittel>
                {contentRenderer && (
                    <div className={styles.stepContainer__stepHeader__content}>{contentRenderer()}</div>
                )}
            </div>
            <hr className={styles.hr} />
        </>
    );
};

const Step = ({ headerProps, children }: StepProps) => {
    return (
        <div className={styles.stepContainer}>
            {headerProps && <StepHeader {...headerProps} />}
            {children}
        </div>
    );
};
export default Step;
